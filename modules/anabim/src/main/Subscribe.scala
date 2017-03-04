package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

case class Subscribe(
  id: Int,
  done: Boolean,
  state: String,
  email: String,
  name: String,
  phone: String,
  month: Int,
  bonusDay: Int,
  price: Int,
  info: String,
  coupon: Option[Coupon] = None,
  createAt: DateTime
)

object Subscribe {

  implicit val formatCoupon = Json.format[Coupon]
  implicit val formatSubscribe = Json.format[Subscribe]

  import reactivemongo.bson._

  implicit val BSONReaderSubscribe = new BSONDocumentReader[Subscribe] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): Subscribe = {
      Subscribe(
        id = ~doc.getAs[Int]("_id"),
        done = ~doc.getAs[Boolean]("done"),
        state = ~doc.getAs[String]("state"),
        email = ~doc.getAs[String]("email"),
        name = ~doc.getAs[String]("name"),
        phone = ~doc.getAs[String]("phone"),
        month = ~doc.getAs[Int]("month"),
        bonusDay = ~doc.getAs[Int]("bonusDay"),
        price = ~doc.getAs[Int]("price"),
        info = ~doc.getAs[String]("info"),
        coupon = doc.getAs[Coupon]("coupon"),
        createAt = doc.getAs[DateTime]("createAt").get
      )
    }
  }

}