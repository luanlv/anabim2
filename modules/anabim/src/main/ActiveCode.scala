package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class ActiveCode(
  id: Int,
  code: String,
  day: Int,
  email: String,
  all: Boolean,
  quantity: Int,
  used: Boolean
)

private[anabim] object ActiveCode {

  implicit val formatActiveCode = Json.format[ActiveCode]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCourse = new BSONDocumentReader[ActiveCode] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): ActiveCode = {
      ActiveCode(
        id = ~doc.getAs[Int]("_id"),
        code = ~doc.getAs[String]("code"),
        day = ~doc.getAs[Int]("day"),
        email = ~doc.getAs[String]("email"),
        all = ~doc.getAs[Boolean]("all"),
        quantity = ~doc.getAs[Int]("quantity"),
        used = ~doc.getAs[Boolean]("used")
      )
    }
  }

}