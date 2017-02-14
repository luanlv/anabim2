package lila.anabim

import reactivemongo.api.commands.WriteResult

import scala.concurrent.Future
import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json._
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import BSONHandlers._
import lila.db.BSON._
import scala.concurrent.ExecutionContext.Implicits.global
import lila.db.dsl._

object CourseRepo {

  private lazy val coll = Env.current.courseColl

  def insert(newCourse: Course): Future[WriteResult] = {
    coll.insert(newCourse)
  }

  def update(newCourse: Course): Future[WriteResult] = {

    coll.update(
      BSONDocument("_id" -> newCourse.id),
      BSONDocument(
        "$set" -> BSONDocument(
          "name" -> newCourse.name,
          "cover" -> BSONDocument(
            "_id" -> newCourse.cover.id,
            "filename" -> newCourse.cover.filename,
            "contentType" -> newCourse.cover.contentType,
            "path" -> newCourse.cover.path,
            "createAt" -> BSONDateTime(newCourse.cover.createAt.getMillis)
          ),
          "slug" -> newCourse.slug,
          "cateID" -> newCourse.cateID,
          "softID" -> newCourse.softID,
          "level" -> newCourse.level,
          "authorId" -> newCourse.author,
          "section" -> newCourse.section,
          "description" -> newCourse.description,
          "documents" -> newCourse.documents,
          "related" -> newCourse.related
        )
       )
    )
  }

  def getCourse(page: Int, nb: Int = 100): Fu[List[Course]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .skip((page-1)*nb)
      .cursor[Course]()
      .gather[List](nb)
  }

  def getAll(): Fu[List[Course]] = {
    coll.find(BSONDocument())
      .cursor[Course]()
      .gather[List]()
  }

  def getCourseBySlug(slug: String) = {
    coll.find(BSONDocument("slug" -> slug))
      .cursor[Course]()
      .headOption
  }

 def getCourseByCateID(cateID: Int) = {
   coll.find(BSONDocument("cateID" -> cateID))
     .cursor[Course]()
     .gather[List]()
  }

 def getCourseBySoftID(softID: Int) = {
   coll.find(BSONDocument("softID" -> softID))
     .cursor[Course]()
     .gather[List]()
  }

  def getRelatedCourse(cateID: List[Int]) = {
    coll.find(BSONDocument("cateID" -> BSONDocument("$in" -> cateID)))
      .cursor[Course]()
      .gather[List]()
  }

  def getCourseById(courseId: Int) = {
    coll.find(BSONDocument("_id" -> courseId))
      .cursor[Course]()
      .headOption
  }

  def getCoursesWithUser(userId: String, page: Int, nb: Int = 100): Fu[List[Course]] = {
    coll.find(BSONDocument(),
      BSONDocument(
        "_id" -> 1,
        "name" -> 1,
        "cover" -> 1,
        "slug" -> 1,
        "cateID" -> 1,
        "softID" -> 1,
        "level" -> 1,
        "authorID" -> 1,
        "section" -> 1,
        "description" -> 1,
        "vote" -> 1,
        "numVote" -> 1,
        "voter" -> BSONDocument("$elemMatch" -> BSONDocument("$eq" -> userId))
    )
    )
      .sort(BSONDocument("_id" -> -1))
      .skip((page-1)*nb)
      .cursor[Course]()
      .gather[List](nb)
  }

  def vote(userId: String, courseID: Int, num: Int) = {
    val course = getCourseById(courseID).await
    coll.update(

      BSONDocument("_id" -> courseID, "likes" -> BSONDocument("$ne" -> userId)),
      BSONDocument(
        "$set" -> BSONDocument("vote" -> (course.get.vote + num)/(course.get.numVote + 1)),
        "$inc" -> BSONDocument("numVote" -> 1),
        "$push" -> BSONDocument("likes" -> userId)
      )
    ).void
  }

  def revote(userId: String, postId: String) = {
    coll.update(
      BSONDocument("_id" -> postId, "likes" -> userId),
      BSONDocument(
        "$inc" -> BSONDocument("likeCount" -> -1),
        "$pull" -> BSONDocument("likes" -> userId)
      )
    ).void
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]