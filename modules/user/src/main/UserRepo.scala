package lila.user

import com.roundeights.hasher.Implicits._
import org.joda.time.DateTime
import reactivemongo.api._
import reactivemongo.api.commands.GetLastError
import reactivemongo.bson._
import lila.common.{ ApiVersion, LightUser }
import lila.db.BSON.BSONJodaDateTimeHandler
import lila.db.dsl._

object UserRepo {

  import User.userBSONHandler

  import User.ID
  import User.{ BSONFields => F }

  // dirty
  private val coll = Env.current.userColl
  import reactivemongo.api.collections.bson.BSONBatchCommands.AggregationFramework.{ Match, Project, Group, GroupField, SumField, SumValue }

  val normalize = User normalize _

  def topNbGame(nb: Int): Fu[List[User]] =
    coll.find(enabledSelect).sort($sort desc "count.game").cursor[User]().gather[List](nb)

  def getUsers(page: Int, nb: Int = 100): Fu[List[User]] =
    coll.find(BSONDocument()).sort($sort desc "createdAt").skip((page - 1) * nb).cursor[User]().gather[List](nb)

  def getMembershipUsers(page: Int, nb: Int = 100): Fu[List[User]] =
    coll.find(BSONDocument(
      "member" -> BSONDocument(
        "$in" -> BSONArray("membership", "trial")
      )
    )).sort($sort desc "createdAt").skip((page - 1) * nb).cursor[User]().gather[List](nb)
  def byId(id: ID): Fu[Option[User]] = coll.byId[User](id)

  def byIds(ids: Iterable[ID]): Fu[List[User]] = coll.byIds[User](ids)

  def byEmail(email: String): Fu[Option[User]] = coll.uno[User]($doc(F.email -> email))

  def idByEmail(email: String): Fu[Option[String]] =
    coll.primitiveOne[String]($doc(F.email -> email), "_id")

  def enabledByEmail(email: String): Fu[Option[User]] = byEmail(email) map (_ filter (_.enabled))

  def pair(x: Option[ID], y: Option[ID]): Fu[(Option[User], Option[User])] =
    coll.byIds[User](List(x, y).flatten) map { users =>
      x.??(xx => users.find(_.id == xx)) ->
        y.??(yy => users.find(_.id == yy))
    }

  def byOrderedIds(ids: Seq[ID]): Fu[List[User]] =
    coll.byOrderedIds[User](ids)(_.id)

  def enabledByIds(ids: Iterable[ID]): Fu[List[User]] =
    coll.list[User](enabledSelect ++ $inIds(ids))

  def enabledById(id: ID): Fu[Option[User]] =
    coll.uno[User](enabledSelect ++ $id(id))

  def named(username: String): Fu[Option[User]] = coll.byId[User](normalize(username))

  def nameds(usernames: List[String]): Fu[List[User]] = coll.byIds[User](usernames.map(normalize))

  def usersFromSecondary(userIds: Seq[ID]): Fu[List[User]] =
    coll.byOrderedIds[User](userIds, readPreference = ReadPreference.secondaryPreferred)(_.id)

  private[user] def allSortToints(nb: Int) =
    coll.find($empty).sort($sort desc F.toints).cursor[User]().gather[List](nb)

  def usernameById(id: ID) =
    coll.primitiveOne[String]($id(id), F.username)

  def usernamesByIds(ids: List[ID]) =
    coll.distinct[String, List](F.username, $inIds(ids).some)

  def setProfile(id: ID, profile: Profile): Funit =
    coll.update(
      $id(id),
      $set(F.profile -> Profile.profileBSONHandler.write(profile))
    ).void

  def newSub(id: ID, month: Int) = {
    val newInfo = Info(
      start = DateTime.now(),
      end = DateTime.now().plusMonths(month)
    )
    coll.update(
      $id(id),
      $set(
        F.member -> "membership",
        F.info -> Info.infoBSONHandler.write(newInfo)
      )
    ).void
  }

  def trialMember(id: ID, day: Int) = {
    println("setting trial member")
    val newInfo = Info(
      start = DateTime.now(),
      end = DateTime.now().plusDays(day)
    )
    coll.update(
      $id(id),
      $set(
        F.member -> "trial",
        F.info -> Info.infoBSONHandler.write(newInfo)
      )
    ).void
  }

  def updateEndDate(email: String, date: DateTime) = {
    coll.update(
      $id(email),
      $set(
        "info.end" -> date
      )
    ).void
  }

  def setInfo(id: ID, info: Info): Funit =
    coll.update(
      $id(id),
      $set(F.info -> Info.infoBSONHandler.write(info))
    ).void

  def setTitle(id: ID, title: Option[String]): Funit = title match {
    case Some(t) => coll.updateField($id(id), F.title, t).void
    case None => coll.update($id(id), $unset(F.title)).void
  }

  val enabledSelect = $doc(F.enabled -> true)

  val sortCreatedAtDesc = $sort desc F.createdAt

  def incToints(id: ID, nb: Int) = coll.update($id(id), $inc("toints" -> nb))
  def removeAllToints = coll.update($empty, $unset("toints"), multi = true)

  def authenticateById(id: ID, password: String): Fu[Option[User]] =
    checkPasswordById(id) map { _ flatMap { _(password) } }

  def authenticateByEmail(email: String, password: String): Fu[Option[User]] =
    checkPasswordByEmail(email) map { _ flatMap { _(password) } }

  private case class AuthData(password: String, salt: String, sha512: Option[Boolean]) {
    def compare(p: String) = password == (~sha512).fold(hash512(p, salt), hash(p, salt))
  }

  private implicit val AuthDataBSONHandler = Macros.handler[AuthData]

  def checkPasswordById(id: ID): Fu[Option[User.LoginCandidate]] =
    checkPassword($id(id))

  def checkPasswordByEmail(email: String): Fu[Option[User.LoginCandidate]] =
    checkPassword($doc(F.email -> email))

  private def checkPassword(select: Bdoc): Fu[Option[User.LoginCandidate]] =
    coll.uno[AuthData](select) zip coll.uno[User](select) map {
      case (Some(login), Some(user)) if user.enabled => User.LoginCandidate(user, login.compare).some
      case _ => none
    }

  def getPasswordHash(id: ID): Fu[Option[String]] =
    coll.primitiveOne[String]($id(id), "password")

  def create(
    username: String,
    password: String,
    name: String,
    email: Option[String],
    avatar: String,
    blind: Boolean,
    mobileApiVersion: Option[ApiVersion],
    mustConfirmEmail: Boolean = false
  ): Fu[Option[User]] =
    !nameExists(username) flatMap {
      _ ?? {
        val doc = newUser(
          username = username,
          password = password,
          name = name,
          avatar = avatar,
          email = email,
          blind = blind,
          mobileApiVersion = mobileApiVersion,
          mustConfirmEmail = mustConfirmEmail
        ) ++
          ("len" -> BSONInteger(username.size))
        coll.insert(doc) >> named(normalize(username))
      }
    }

  def create2(
    username: String,
    password: String,
    email: Option[String],
    avatar: String,
    blind: Boolean,
    mobileApiVersion: Option[ApiVersion],
    mustConfirmEmail: Boolean = false
  ): Fu[Option[User]] =
    !nameExists(username) flatMap {
      _ ?? {
        println("=============")
        println(avatar)
        val doc = newUser(
          username = username,
          password = password,
          name = username,
          avatar = avatar,
          email = email,
          blind = blind,
          mobileApiVersion = mobileApiVersion
        ) ++
          ("len" -> BSONInteger(username.size))
        coll.insert(doc) >> named(normalize(username))
      }
    }

  def nameExists(username: String): Fu[Boolean] = idExists(normalize(username))
  def idExists(id: String): Fu[Boolean] = coll exists $id(id)

  /**
   * Filters out invalid usernames and returns the IDs for those usernames
   *
   * @param usernames Usernames to filter out the non-existent usernames from, and return the IDs for
   * @return A list of IDs for the usernames that were given that were valid
   */
  def existingUsernameIds(usernames: Set[String]): Fu[List[String]] =
    coll.primitive[String]($inIds(usernames.map(normalize)), "_id")

  private val userIdPattern = """^[\w-]{3,20}$""".r.pattern

  def usernamesLike(text: String, max: Int = 10): Fu[List[String]] = {
    val id = normalize(text)
    if (!userIdPattern.matcher(id).matches) fuccess(Nil)
    else {
      import java.util.regex.Matcher.quoteReplacement
      val regex = "^" + id + ".*$"
      coll.find(
        $doc("_id".$regex(regex, "")) ++ enabledSelect,
        $doc(F.username -> true)
      )
        .sort($doc("len" -> 1))
        .cursor[Bdoc](ReadPreference.secondaryPreferred).gather[List](max)
        .map {
          _ flatMap { _.getAs[String](F.username) }
        }
    }
  }

  def updateName(userID: ID, v: String) = coll.updateField($id(userID), "name", v)

  def updateMember(userID: ID, v: String) = coll.updateField($id(userID), "member", v)

  def setRoles(id: ID, roles: List[String]) = coll.updateField($id(id), "roles", roles)

  def enable(id: ID) = coll.updateField($id(id), F.enabled, true)

  def passwd(id: ID, password: String): Funit =
    coll.primitiveOne[String]($id(id), "salt") flatMap { saltOption =>
      saltOption ?? { salt =>
        coll.update($id(id), $set(
          "password" -> hash(password, salt),
          "sha512" -> false
        )).void
      }
    }

  def email(id: ID, email: String): Funit = coll.updateField($id(id), F.email, email).void

  def email(id: ID): Fu[Option[String]] = coll.primitiveOne[String]($id(id), F.email)

  def hasEmail(id: ID): Fu[Boolean] = email(id).map(_.isDefined)

  def setSeenAt(id: ID) {
    coll.updateFieldUnchecked($id(id), "seenAt", DateTime.now)
  }

  def recentlySeenNotKidIdsCursor(since: DateTime)(implicit cp: CursorProducer[Bdoc]) =
    coll.find($doc(
      F.enabled -> true,
      "seenAt" $gt since,
      "count.game" $gt 9,
      "kid" $ne true
    ), $id(true)).cursor[Bdoc](readPreference = ReadPreference.secondary)

  def setLang(id: ID, lang: String) = coll.updateField($id(id), "lang", lang).void

  def idsSumToints(ids: Iterable[String]): Fu[Int] =
    ids.nonEmpty ?? coll.aggregate(
      Match($inIds(ids)),
      List(Group(BSONNull)(F.toints -> SumField(F.toints)))
    ).map(
        _.firstBatch.headOption flatMap { _.getAs[Int](F.toints) }
      ).map(~_)

  def userIdsWithRoles(roles: List[String]): Fu[Set[User.ID]] =
    coll.distinct[String, Set]("_id", $doc("roles" $in roles).some)

  def mustConfirmEmail(id: String): Fu[Boolean] =
    coll.exists($doc(F.id -> id, F.mustConfirmEmail -> true))

  def setEmailConfirmed(id: String): Funit = coll.update($id(id), $unset(F.mustConfirmEmail)).void

  private def newUser(
    username: String,
    password: String,
    name: String,
    avatar: String,
    email: Option[String],
    blind: Boolean,
    mobileApiVersion: Option[ApiVersion],
    mustConfirmEmail: Boolean = false
  ) = {

    val salt = ornicar.scalalib.Random nextStringUppercase 32
    import lila.db.BSON.BSONJodaDateTimeHandler

    $doc(
      F.id -> normalize(username),
      F.username -> username,
      F.name -> name,
      F.member -> "none",
      F.avatar -> avatar,
      F.email -> email,
      F.roles -> List("student"),
      F.mustConfirmEmail -> mustConfirmEmail,
      "password" -> hash(password, salt),
      "salt" -> salt,
      F.enabled -> true,
      F.createdAt -> DateTime.now,
      F.seenAt -> DateTime.now
    ) ++ {
        if (blind) $doc("blind" -> true) else $empty
      }
  }

  private def hash(pass: String, salt: String): String = "%s{%s}".format(pass, salt).sha1
  private def hash512(pass: String, salt: String): String = "%s{%s}".format(pass, salt).sha512
}