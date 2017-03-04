package lila.security

import akka.actor.ActorSystem
import com.roundeights.hasher.Algo
import play.api.libs.ws.{ WS, WSAuthScheme }
import play.api.Play.current
import scala.concurrent.duration._

import lila.common.String.base64
import lila.user.{ User, UserRepo }

trait EmailConfirm {

  def effective: Boolean

  def send(user: User, email: String, tryNb: Int = 1): Funit

  def sendWelcome(user: User, email: String, tryNb: Int = 1): Funit

  def confirm(token: String): Fu[Option[User]]
}

object EmailConfirmSkip extends EmailConfirm {

  def effective = false

  def send(user: User, email: String, tryNb: Int = 1) = UserRepo setEmailConfirmed user.id

  def sendWelcome(user: User, email: String, tryNb: Int = 1) = UserRepo setEmailConfirmed user.id

  def confirm(token: String): Fu[Option[User]] = fuccess(none)
}

final class EmailConfirmMailGun(
    apiUrl: String,
    apiKey: String,
    sender: String,
    replyTo: String,
    baseUrl: String,
    secret: String,
    system: ActorSystem
) extends EmailConfirm {
  def effective = true

  val maxTries = 3

  def send(user: User, email: String, tryNb: Int = 1): Funit = {
    println(s"send email to ${email} !!!!!!!!!!")
    println(apiKey)
    tokener make user flatMap { token =>
      val url = s"$baseUrl/signup/confirm/$token"
      WS.url(s"$apiUrl/messages").withAuth("api", apiKey, WSAuthScheme.BASIC).post(Map(
        "from" -> Seq(sender),
        "to" -> Seq(email),
        "h:Reply-To" -> Seq(replyTo),
        "o:tag" -> Seq("registration"),
        "subject" -> Seq(s"Kích hoạt tài khoản trên edu.anabim.com, ${user.username}"),
        "text" -> Seq(s"""
Chào mừng bạn đến với trung tâm Anabim

Để kích hoạt tài khoản, bạn chỉ cần click vào link phía bên dưới.

$url

Chúc bạn học tập thật vui vẻ và đạt được nhiều thành công trong cuộc sống và công việc.
"""),
        "html" -> Seq(s"""<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Kích hoạt tài khoản trên edu.anabim.com, ${user.username}</title>
  </head>
  <body>
    <div itemscope itemtype="http://schema.org/EmailMessage">
      <p itemprop="description">Để kích hoạt tài khoản, bạn chỉ cần click vào link phía bên dưới.</p>
      <div itemprop="potentialAction" itemscope itemtype="http://schema.org/ViewAction">
        <meta itemprop="name" content="Activate account">
        <meta itemprop="url" content="$url">
        <p><a itemprop="target" href="$url">$url</a></p>
      </div>
      <p>Chúc bạn học tập thật vui vẻ và đạt được nhiều thành công trong cuộc sống và công việc.</>
    </div>
  </body>
</html>""")
      )).void addFailureEffect {
        case e: java.net.ConnectException => lila.mon.http.mailgun.timeout()
        case _ =>
      } recoverWith {
        case e if tryNb < maxTries => akka.pattern.after(15 seconds, system.scheduler) {
          send(user, email, tryNb + 1)
        }
        case e => fufail(e)
      }
    }
  }

  def sendWelcome(user: User, email: String, tryNb: Int = 1): Funit = {
    tokener make user flatMap { token =>
      val url = s"$baseUrl/signup/confirm/$token"
      WS.url(s"$apiUrl/messages").withAuth("api", apiKey, WSAuthScheme.BASIC).post(Map(
        "from" -> Seq(sender),
        "to" -> Seq(email),
        "h:Reply-To" -> Seq(replyTo),
        "o:tag" -> Seq("registration"),
        "subject" -> Seq(s"Chào mừng bạn đến với edu.anabim.com, ${user.username}"),
        "text" -> Seq(s"""
Chúc mừng bạn đã là thành viên của edu.anabim.com.

Chúng tôi hứa sẽ không ngừng nâng cao chất lượng dịch vụ của mình để giúp đỡ bạn nhiều nhất có thể..
"""),
        "html" -> Seq(s"""<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Chào mừng bạn đến với edu.anabim.com, ${user.username}</title>
  </head>
  <body>
    <div itemscope itemtype="http://schema.org/EmailMessage">
      <p itemprop="description">Chúc mừng bạn đã là thành viên của edu.anabim.com.</p>
      <p>Chúng tôi hứa sẽ không ngừng nâng cao chất lượng dịch vụ của mình để giúp đỡ bạn nhiều nhất có thể..</>
    </div>
  </body>
</html>""")
      )).void addFailureEffect {
        case e: java.net.ConnectException => lila.mon.http.mailgun.timeout()
        case _ =>
      } recoverWith {
        case e if tryNb < maxTries => akka.pattern.after(15 seconds, system.scheduler) {
          send(user, email, tryNb + 1)
        }
        case e => fufail(e)
      }
    }
  }

  def confirm(token: String): Fu[Option[User]] = tokener read token flatMap {
    case u @ Some(user) => UserRepo setEmailConfirmed user.id inject u
    case _ => fuccess(none)
  }

  private object tokener {

    private val separator = '|'

    private def makeHash(msg: String) = {
      Algo.hmac(secret).sha1(msg).hex take 14
    }
    private def getHashedEmail(userId: User.ID) = {
      UserRepo email userId map { p =>
        val x = makeHash(~p) take 6
        x
      }
    }
    private def makePayload(userId: String, passwd: String) = s"$userId$separator$passwd"

    def make(user: User) = {
      getHashedEmail(user.id) map { hashedEmail =>
        val payload = makePayload(user.id, hashedEmail)
        val hash = makeHash(payload)
        val token = s"$payload$separator$hash"
        base64 encode token
      }
    }

    def read(token: String): Fu[Option[User]] = (base64 decode token) ?? {
      _ split separator match {
        case Array(userId, userHashedEmail, hash) if makeHash(makePayload(userId, userHashedEmail)) == hash =>
          getHashedEmail(userId) flatMap { hashedEmail =>
            (userHashedEmail == hashedEmail) ?? (UserRepo enabledById userId)
          }
        case _ => fuccess(none)
      }
    }
  }
}