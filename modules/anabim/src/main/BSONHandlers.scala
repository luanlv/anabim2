package lila.anabim

import lila.common.LightUser
import lila.user.LightUserApi
import lila.db.BSON
import reactivemongo.bson._
import org.joda.time.DateTime
import lila.image.Image

object BSONHandlers {

  implicit val courseBSONHandler = new BSON[Course] {
    def reads(r: BSON.Reader) = {
      Course(
        id = r int "_id",
        name = r str "name",
        cover = r get[Image] "cover",
        slug = r str "slug",
        cateID = r get[List[Int]] "cateID",
        softID = r get[List[Int]] "softID",
        level = r int "level",
        author = r str "authorId",
        section = r get[List[String]] "section",
        description = r get[String] "description",
        documents = r getO[String] "documents",
        related = r getO[List[Int]] "related",
        vote = r get[Int] "vote",
        numVote = r get[Int] "numVote",
        voter = r getO[List[String]] "voter"
      )
    }

    def writes(w: BSON.Writer, o: Course) = {
      BSONDocument(
        "_id" -> o.id,
        "name" -> o.name,
        "cover" -> BSONDocument(
          "_id" -> o.cover.id,
          "filename" -> o.cover.filename,
          "contentType" -> o.cover.contentType,
          "path" -> o.cover.path,
          "createAt" -> BSONDateTime(o.cover.createAt.getMillis)
        ),
        "slug" -> o.slug,
        "cateID" -> o.cateID,
        "softID" -> o.softID,
        "level" -> o.level,
        "authorId" -> o.author,
        "section" -> o.section,
        "description" -> o.description,
        "documents" -> o.documents,
        "related" -> o.related,
        "vote" -> o.vote,
        "numVote" -> o.numVote,
        "voter" -> o.voter
      )
    }
  }

  implicit val videoBSONHandler = new BSON[Video] {
    def reads(r: BSON.Reader) = {
      Video(
        id = r int "_id",
        stt = r double  "stt",
        courseId = r int "courseId",
        section = r int "section",
        name = r str "name",
        link = r str "link",
        kind = r str "kind",
        url = r str "url",
        source = r str "source",
        time = r int "time"
      )
    }

    def writes(w: BSON.Writer, o: Video) = {
      BSONDocument(
        "_id" -> o.id,
        "stt" -> o.stt,
        "courseId" -> o.courseId,
        "section" -> o.section,
        "name" -> o.name,
        "link" -> o.link,
        "kind" -> o.kind,
        "url" -> o.url,
        "source" -> o.source,
        "time" -> o.time
      )
    }
  }

  implicit val cateBSONHandler = new BSON[Cate] {
    def reads(r: BSON.Reader) = {
      Cate(
        id = r int "_id",
        name = r str "name",
        cover = r get[Image] "cover",
        slug = r str "slug",
        description = r str "description"
      )
    }

    def writes(w: BSON.Writer, o: Cate) = {
      BSONDocument(
        "_id" -> o.id,
        "name" -> o.name,
        "cover" -> BSONDocument(
          "_id" -> o.cover.id,
          "filename" -> o.cover.filename,
          "contentType" -> o.cover.contentType,
          "path" -> o.cover.path,
          "createAt" -> BSONDateTime(o.cover.createAt.getMillis)
        ),
        "slug" -> o.slug,
        "description" -> o.description
      )
    }
  }

  implicit val softBSONHandler = new BSON[Software] {
    def reads(r: BSON.Reader) = {
      Software(
        id = r int "_id",
        name = r str "name",
        cover = r get[Image] "cover",
        slug = r str "slug"
      )
    }

    def writes(w: BSON.Writer, o: Software) = {
      BSONDocument(
        "_id" -> o.id,
        "name" -> o.name,
        "cover" -> BSONDocument(
          "_id" -> o.cover.id,
          "filename" -> o.cover.filename,
          "contentType" -> o.cover.contentType,
          "path" -> o.cover.path,
          "createAt" -> BSONDateTime(o.cover.createAt.getMillis)
        ),
        "slug" -> o.slug
      )
    }
  }

  implicit val couponBSONHandler = new BSON[Coupon] {
    def reads(r: BSON.Reader) = {
      Coupon(
        id = r int "_id",
        code = r str "code",
        kind = r int "kind",
        price = r intO "price",
        percent = r intO "percent",
        day = r intO "day",
        month = r get[List[Int]] "month",
        active = r bool "active",
        quantity = r int "quantity",
        endTime = r date "endTime"
      )
    }

    def writes(w: BSON.Writer, o: Coupon) = {
      BSONDocument(
        "_id" -> o.id,
        "code" -> o.code,
        "kind" -> o.kind,
        "price" -> o.price,
        "percent" -> o.percent,
        "day" -> o.day,
        "month" -> o.month,
        "active" -> o.active,
        "quantity" -> o.quantity,
        "endTime" -> BSONDateTime(o.endTime.getMillis)
      )
    }
  }

  implicit val activeCodeBSONHandler = new BSON[ActiveCode] {
    def reads(r: BSON.Reader) = {
      ActiveCode(
        id = r int "_id",
        code = r str "code",
        day = r int "day",
        email = r str "email",
        all = r bool "all",
        quantity = r int "quantity",
        used = r bool "used"
      )
    }

    def writes(w: BSON.Writer, o: ActiveCode) = {
      BSONDocument(
        "_id" -> o.id,
        "code" -> o.code,
        "day" -> o.day,
        "email" -> o.email,
        "all" -> o.all,
        "quantity" -> o.quantity,
        "used" -> o.used
      )
    }
  }


  implicit val subscribeBSONHandler = new BSON[Subscribe] {
    def reads(r: BSON.Reader) = {
      Subscribe(
        id = r int "_id",
        done = r bool "done",
        state = r str "state",
        email = r str "email",
        name = r str "name",
        phone = r str "phone",
        month = r int "month",
        bonusDay = r int "bonusDay",
        price = r int "price",
        info = r str "info",
        coupon = r getO[Coupon] "coupon",
        createAt = r date "createAt"
      )
    }

    def writes(w: BSON.Writer, o: Subscribe) = {
      BSONDocument(
        "_id" -> o.id,
        "done" -> o.done,
        "state" -> o.state,
        "email" -> o.email,
        "name" -> o.name,
        "phone" -> o.phone,
        "month" -> o.month,
        "bonusDay" -> o.bonusDay,
        "price" -> o.price,
        "info" -> o.info,
        "coupon" -> o.coupon,
        "createAt" -> BSONDateTime(o.createAt.getMillis)
      )
    }
  }

  implicit val priceBSONHandler = new BSON[Price] {
    def reads(r: BSON.Reader) = {
      Price(
        one = r int "one",
        three = r int "three",
        six = r int "six",
        twelve = r int "twelve"
      )
    }

    def writes(w: BSON.Writer, o: Price) = {
      BSONDocument(
        "one" -> o.one,
        "three" -> o.three,
        "six" -> o.six,
        "twelve" -> o.twelve
      )
    }
  }

  implicit val cateWithCoursesBSONHandler = new BSON[CateWithCourses] {
    def reads(r: BSON.Reader) = {
      CateWithCourses(
        category = r get[Cate] "category",
        courses = r get[List[Course]] "courses"
      )
    }

    def writes(w: BSON.Writer, o: CateWithCourses) = {
      BSONDocument(
        "category" -> o.category,
        "courses" -> o.courses
      )
    }
  }


  implicit val indexCourseBSONHandler = new BSON[IndexCourse] {
    def reads(r: BSON.Reader) = {
      IndexCourse(
        value = r get[List[CateWithCourses]] "value"
      )
    }

    def writes(w: BSON.Writer, o: IndexCourse) = {
      BSONDocument(
        "value" -> o.value
      )
    }
  }

  implicit val childCommentBSONHandler = new BSON[ChildComment] {
    def reads(r: BSON.Reader) = {
      ChildComment(
        id = r int "_id",
        comment = r str "comment",
        user = lila.user.Env.current.lightUserApi.get(r str "userId").getOrElse(LightUser("", "", None, "", "")),
        time = r date "time"
      )
    }
    def writes(w: BSON.Writer, o: ChildComment) = {
      BSONDocument(
        "_id" -> o.id,
        "comment" -> o.comment,
        "userId" -> o.user.id,
        "time" -> w.date(o.time)
      )
    }
  }

  implicit val commentBSONHandler = new BSON[Comment] {

    def reads(r: BSON.Reader) = {
      Comment(
        id = r int "_id",
        kind = r str "kind",
        parentID = r int "parentID",
        users = r get[List[String]] "users",
        comment = r str "comment",
        user = lila.user.Env.current.lightUserApi.get(r str "userId").get,
        time = r date "time",
        children = r get[List[ChildComment]] "children"
      )
    }

    def writes(w: BSON.Writer, o: Comment) = {
      BSONDocument(
        "_id" -> o.id,
        "kind" -> o.kind,
        "parentID" -> o.parentID,
        "users" -> o.users,
        "comment" -> o.comment,
        "userId" -> o.user.id,
        "time" -> w.date(o.time),
        "children" -> o.children
      )
    }
  }

}