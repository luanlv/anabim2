package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class Cate(
  id: Int,
  name: String,
  cover: ImageModel,
  slug: String,
  description: String
)

private[anabim] object Cate {

  implicit val formatCategory = Json.format[Cate]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCate = new BSONDocumentReader[Cate] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Cate = {
      Cate(
        id = ~doc.getAs[Int]("_id"),
        name = ~doc.getAs[String]("name"),
        cover = doc.getAs[ImageModel]("cover").get,
        slug = ~doc.getAs[String]("slug"),
        description = ~doc.getAs[String]("description")
      )
    }
  }

}