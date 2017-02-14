package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{Image => ImageModel}

private[anabim] case class Price(
                                 one: Int,
                                 three: Int,
                                 six: Int,
                                 twelve: Int
                               )

private[anabim] object Price {


  implicit val formatPrice= Json.format[Price]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderPrice = new BSONDocumentReader[Price] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Price = {
      Price(
        one = ~doc.getAs[Int]("one"),
        three = ~doc.getAs[Int]("three"),
        six = ~doc.getAs[Int]("six"),
        twelve = ~doc.getAs[Int]("twelve")
      )
    }
  }

}