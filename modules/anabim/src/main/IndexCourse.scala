package lila.anabim

import lila.common.LightUser
import org.joda.time.DateTime
import play.api.libs.json._
import lila.image.{ Image => ImageModel }

private[anabim] case class CateWithCourses(
  category: Cate,
  courses: List[Course]
)

private[anabim] object CateWithCourses {

  implicit val formatCateWithCourses = Json.format[CateWithCourses]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderCateWithCourses = new BSONDocumentReader[CateWithCourses] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): CateWithCourses = {
      CateWithCourses(
        category = doc.getAs[Cate]("category").get,
        courses = doc.getAs[List[Course]]("courses").get
      )
    }
  }

}

private[anabim] case class IndexCourse(
  value: List[CateWithCourses]
)

private[anabim] object IndexCourse {

  implicit val formatCateWithCourses = Json.format[CateWithCourses]
  implicit val formatIndexCourse = Json.format[IndexCourse]

  import reactivemongo.bson._

  private[anabim] implicit val BSONReaderIndexCourse = new BSONDocumentReader[IndexCourse] {

    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }

    def read(doc: BSONDocument): IndexCourse = {
      IndexCourse(
        value = doc.getAs[List[CateWithCourses]]("value").get
      )
    }
  }

}