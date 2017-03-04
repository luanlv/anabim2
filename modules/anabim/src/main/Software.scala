package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class Software(
  id: Int,
  name: String,
  cover: ImageModel,
  slug: String
)

private[anabim] object Software {

  implicit val formatSoftware = Json.format[Software]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderSoftware = new BSONDocumentReader[Software] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Software = {
      Software(
        id = ~doc.getAs[Int]("_id"),
        name = ~doc.getAs[String]("name"),
        cover = doc.getAs[ImageModel]("cover").get,
        slug = ~doc.getAs[String]("slug")
      )
    }
  }

}