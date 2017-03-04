package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._

private[anabim] case class Comment(
  id: Int,
  kind: String,
  parentID: Int,
  users: List[String] = List(),
  comment: String,
  user: LightUser,
  time: DateTime,
  children: List[ChildComment] = List()
)

private[anabim] case class ChildComment(
  id: Int,
  comment: String,
  user: LightUser,
  time: DateTime
)

private[anabim] object ChildComment {
  implicit val lightUser = Json.format[LightUser]
  implicit val formatChildComment = Json.format[ChildComment]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderChildComment = new BSONDocumentReader[ChildComment] {
    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }
    def read(doc: BSONDocument): ChildComment = {
      ChildComment(
        id = ~doc.getAs[Int]("_id"),
        comment = ~doc.getAs[String]("comment"),
        user = lila.user.Env.current.lightUserApi.get(~doc.getAs[String]("userId")).head,
        time = doc.getAs[DateTime]("time").head
      )
    }
  }
}

private[anabim] object Comment {

  import reactivemongo.bson.Macros
  import lila.db.BSON
  implicit val lightUser = Json.format[LightUser]
  implicit val formatComment = Json.format[Comment]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderComment = new BSONDocumentReader[Comment] {
    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    implicit val formatChildComment = Json.format[ChildComment]
    def read(doc: BSONDocument): Comment = {
      Comment(
        id = ~doc.getAs[Int]("_id"),
        kind = ~doc.getAs[String]("kind"),
        parentID = ~doc.getAs[Int]("parentID"),
        users = ~doc.getAs[List[String]]("users"),
        comment = ~doc.getAs[String]("comment"),
        user = lila.user.Env.current.lightUserApi.get(~doc.getAs[String]("userId")).head,
        time = doc.getAs[DateTime]("time").head,
        children = doc.getAs[List[ChildComment]]("children").get
      )
    }
  }
}

