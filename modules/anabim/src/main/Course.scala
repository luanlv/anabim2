package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class Course(
  id: Int,
  name: String,
  cover: ImageModel,
  slug: String,
  cateID: List[Int],
  softID: List[Int],
  level: Int,
  author: String,
  section: List[String],
  description: String,
  documents: Option[String] = None,
  related: Option[List[Int]] = None,
  vote: Int = 0,
  numVote: Int = 0,
  voter: Option[List[String]] = Option(List())
)

private[anabim] object Course {

  implicit val lightUser = Json.format[LightUser]
  implicit val formatImage = Json.format[ImageModel]
  implicit val formatCourse = Json.format[Course]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCourse = new BSONDocumentReader[Course] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Course = {
      Course(
        id = ~doc.getAs[Int]("_id"),
        name = ~doc.getAs[String]("name"),
        cover = doc.getAs[ImageModel]("cover").get,
        slug = ~doc.getAs[String]("slug"),
        cateID = ~doc.getAs[List[Int]]("cateID"),
        softID = ~doc.getAs[List[Int]]("softID"),
        level = ~doc.getAs[Int]("level"),
        author = ~doc.getAs[String]("authorId"),
        section = ~doc.getAs[List[String]]("section"),
        description = ~doc.getAs[String]("description"),
        documents = doc.getAs[String]("documents"),
        related = doc.getAs[List[Int]]("related"),
        vote = ~doc.getAs[Int]("vote"),
        numVote = ~doc.getAs[Int]("numVote"),
        voter = doc.getAs[List[String]]("voter")
      )
    }
  }

}