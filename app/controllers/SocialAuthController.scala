package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers._
import lila.app.Env
import lila.common.LilaCookie
import lila.user.UserRepo
import models.User
import models.services.UserService
import play.api.i18n.{ Messages, MessagesApi }
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.{ Action, RequestHeader }

import scala.concurrent.Future

class SocialAuthController @Inject() (
  val messagesApi: MessagesApi,
  val env: Environment[User, CookieAuthenticator],
  //                                       userService: UserService,
  //                                       authInfoRepository: AuthInfoRepository,
  socialProviderRegistry: SocialProviderRegistry
)
    extends Silhouette[User, CookieAuthenticator] with Logger {
  private def env2 = Env.security
  private def api = Env.security.api

  def authenticateSocial(provider: String) = {}

  def authenticate(provider: String, referrer: String = "/") = Action.async { implicit request =>
    (socialProviderRegistry.get[SocialProvider](provider) match {
      case Some(p: SocialProvider with CommonSocialProfileBuilder) => {
        def checkUser(profile: p.Profile) = {
          val user = UserRepo.byId(profile.email.getOrElse("nothing@email.com")).await
          user match {
            case Some(user) => {
              println("finded userd in server")
              println(user)
              user
            }
            case None => {
              val x = UserRepo.create2(
                profile.email.getOrElse("guest@anabim.com"),
                "luan",
                profile.email,
                profile.avatarURL.getOrElse(""),
                false,
                None
              ).flatten(s"No user could be created")
              val user = x.await
              println("create new user")
              println(user)
              env2.emailConfirm.sendWelcome(user, profile.email.getOrElse("nothing@gmail.com"))
              user
            }
          }
        }
        p.authenticate().flatMap {
          case Left(result) => {
            println("left")
            Future.successful(result)
          }
          case Right(authInfo) => {
            println("right")
            println(authInfo)
            for {
              profile <- p.retrieveProfile(authInfo)
              sessionId <- getSession(checkUser(profile).id)
            } yield {
              val cookieUser = LilaCookie.withSession { session =>
                session + ("sessionId" -> sessionId) - api.AccessUri
              }
              println("cokkieUser OK")
              Redirect(referrer).withCookies(cookieUser)
            }
          }
        }
      }
      case _ => Future.failed(new ProviderException(s"Cannot authenticate with unexpected social provider $provider"))
    }).recover {
      case e: ProviderException =>
        logger.error("Unexpected provider error", e)
        Redirect("/")
    }
  }

  def getSession(userId: String)(implicit req: RequestHeader) = {
    println("run getSession with userID=" + userId)
    api.saveAuthentication(userId, None) flatMap { sessionId =>
      println(" seassion ID =" + sessionId)
      Future(sessionId)
    }
  }

}