package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class Coupon(
  id: Int,
  code: String,
  kind: Int,
  price: Option[Int] = None,
  percent: Option[Int] = None,
  day: Option[Int] = None,
  month: List[Int] = List(),
  active: Boolean = true,
  quantity: Int = 1000,
  endTime: DateTime
)

private[anabim] object Coupon {

  implicit val formatCoupon = Json.format[Coupon]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCourse = new BSONDocumentReader[Coupon] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Coupon = {
      Coupon(
        id = ~doc.getAs[Int]("_id"),
        code = ~doc.getAs[String]("code"),
        kind = ~doc.getAs[Int]("kind"),
        price = doc.getAs[Int]("price"),
        percent = doc.getAs[Int]("percent"),
        day = doc.getAs[Int]("day"),
        month = ~doc.getAs[List[Int]]("month"),
        active = ~doc.getAs[Boolean]("active"),
        quantity = ~doc.getAs[Int]("quantity"),
        endTime = doc.getAs[DateTime]("endTime").get
      )
    }
  }

}