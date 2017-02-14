package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._


private[anabim] case class Video(
                                   id: Int,
                                   stt: Double,
                                   courseId: Int,
                                   section: Int,
                                   name: String,
                                   link: String,
                                   kind: String,
                                   url: String,
                                   source: String,
                                   time: Int
                                 )

private[anabim] object Video {

  implicit val formatVideo = Json.format[Video]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCourse = new BSONDocumentReader[Video] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Video = {
      Video(
        id = ~doc.getAs[Int]("_id"),
        stt = ~doc.getAs[Double]("stt"),
        courseId = ~doc.getAs[Int]("courseId"),
        section = ~doc.getAs[Int]("section"),
        name = ~doc.getAs[String]("name"),
        link = ~doc.getAs[String]("link"),
        kind = ~doc.getAs[String]("kind"),
        url = ~doc.getAs[String]("url"),
        source = ~doc.getAs[String]("source"),
        time = ~doc.getAs[Int]("time")
      )
    }

  }

}