package lila.image

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._


case class Image(
                                       id: Int,
                                       filename: String,
                                       contentType: Option[String],
                                       path: String,
                                       createAt: DateTime = DateTime.now()
                                     )

object Image {

  implicit val formatImage = Json.format[Image]

  import reactivemongo.bson._

  implicit val BSONReaderImage = new BSONDocumentReader[Image] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Image = {
      Image(
        id = ~doc.getAs[Int]("_id"),
        filename = ~doc.getAs[String]("filename"),
        contentType = doc.getAs[String]("contentType"),
        path = ~doc.getAs[String]("path"),
        createAt = doc.getAs[DateTime]("createAt").get
      )
    }
  }

}