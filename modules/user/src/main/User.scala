package lila.user

import scala.concurrent.duration._

import lila.common.LightUser

import org.joda.time.DateTime

case class User(
    id: String,
    username: String,
    email: Option[String],
    enabled: Boolean,
    roles: List[String],
    profile: Option[Profile] = None,
    info: Option[Info] = None,
    toints: Int = 0,
    title: Option[String] = None,
    avatar: String,
    name: String,
    member: String = "none",
    time: Option[DateTime] = None,
    createdAt: DateTime,
    seenAt: Option[DateTime],
    lang: Option[String]
    ) extends Ordered[User] {

  override def equals(other: Any) = other match {
    case u: User => id == u.id
    case _       => false
  }

  override def toString =
    s"User $username"

  def light = LightUser(id = id, name = username, title = title, avatar = avatar, member = member, time = time)

  def titleName = title.fold(username)(_ + " " + username)

  def realNameOrUsername = profileOrDefault.nonEmptyRealName | username

  def langs = ("en" :: lang.toList).distinct.sorted

  def compare(other: User) = id compare other.id

  def canTeam = true

  def disabled = !enabled


  def titleUsername = title.fold(username)(t => s"$t $username")


  def profileOrDefault = profile | Profile.default


  def hasTitle = title.isDefined

  lazy val seenRecently: Boolean = timeNoSee < 2.minutes

  def timeNoSee: Duration = seenAt.fold[Duration](Duration.Inf) { s =>
    (nowMillis - s.getMillis).millis
  }




}

object User {

  type ID = String

  type CredentialCheck = String => Boolean
  case class LoginCandidate(user: User, check: CredentialCheck) {
    def apply(password: String): Option[User] = check(password) option user
  }

  val anonymous = "Anonymous"


  case class LightCount(user: LightUser, count: Int)

  case class Active(user: User)

  case class PlayTime(total: Int, tv: Int) {
    import org.joda.time.Period
    def totalPeriod = new Period(total * 1000l)
    def tvPeriod = (tv > 0) option new Period(tv * 1000l)
  }
  import lila.db.BSON.BSONJodaDateTimeHandler
  implicit def playTimeHandler = reactivemongo.bson.Macros.handler[PlayTime]

  // Matches a lichess username with an '@' prefix if it is used as a single
  // word (i.e. preceded and followed by space or appropriate punctuation):
  // Yes: everyone says @ornicar is a pretty cool guy
  // No: contact@lichess.org, @1, http://example.com/@happy0
  val atUsernameRegex = """(?<=\s|^)@(?>([a-zA-Z_-][\w-]{1,19}))(?![\w-])""".r

  val usernameRegex = """^[\w-]+$""".r
  def couldBeUsername(str: String) = usernameRegex.pattern.matcher(str).matches

  def normalize(username: String) = username.toLowerCase

  val titles = Seq(
    "GM" -> "Grandmaster",
    "WGM" -> "Woman Grandmaster",
    "IM" -> "International Master",
    "WIM" -> "Woman Intl. Master",
    "FM" -> "FIDE Master",
    "WFM" -> "Woman FIDE Master",
    "NM" -> "National Master",
    "CM" -> "Candidate Master",
    "WCM" -> "Woman Candidate Master",
    "WNM" -> "Woman National Master",
    "LM" -> "Lichess Master")

  val titlesMap = titles.toMap

  def titleName(title: String) = titlesMap get title getOrElse title

  object BSONFields {
    val id = "_id"
    val username = "username"
    val member = "member"
    val enabled = "enabled"
    val roles = "roles"
    val profile = "profile"
    val toints = "toints"
    val createdAt = "createdAt"
    val seenAt = "seenAt"
    val lang = "lang"
    val title = "title"
    val avatar = "avatar"
    val email = "email"
    val time = "time"
    val name = "name"
    val info = "info"
    val mustConfirmEmail = "mustConfirmEmail"
  }

  import lila.db.BSON
  import lila.db.dsl._

  implicit val userBSONHandler = new BSON[User] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument
    private implicit def profileHandler = Profile.profileBSONHandler
    private implicit def infoHandler = Info.infoBSONHandler

    def reads(r: BSON.Reader): User = User(
      id = r str id,
      username = r str username,
      email = r strO email,
      enabled = r bool enabled,
      roles = ~r.getO[List[String]](roles),
      profile = r.getO[Profile](profile),
      info = r.getO[Info](info),
      toints = r nIntD toints,
      createdAt = r date createdAt,
      seenAt = r dateO seenAt,
      lang = r strO lang,
      title = r strO title,
      avatar = r str avatar,
      name = r str name,
      member = r str member,
      time = r dateO time
      )

    def writes(w: BSON.Writer, o: User) = BSONDocument(
      id -> o.id,
      username -> o.username,
      email -> o.email,
      enabled -> o.enabled,
      roles -> o.roles.some.filter(_.nonEmpty),
      profile -> o.profile,
      info -> o.info,
      toints -> w.intO(o.toints),
      createdAt -> o.createdAt,
      seenAt -> o.seenAt,
      lang -> o.lang,
      title -> o.title,
      avatar -> o.avatar,
      name -> o.name,
      member -> o.member,
      time -> o.time
    )
  }
}
