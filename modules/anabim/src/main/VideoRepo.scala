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

object VideoRepo {

  private lazy val coll = Env.current.videoColl


  def insert(newVideo: Video): Future[WriteResult] = {
    coll.insert(newVideo)
  }


  def removeById(videoID: Int): Future[WriteResult] = {
    coll.remove(
      BSONDocument("_id" -> videoID)
    )
  }

//
  def update(newCourse: Video): Future[WriteResult] = {

    coll.update(
      BSONDocument("_id" -> newCourse.id),
      BSONDocument(
        "$set" -> BSONDocument(
          "stt" -> newCourse.stt,
          "courseId" -> newCourse.courseId,
          "section" -> newCourse.section,
          "name" -> newCourse.name,
          "link" -> newCourse.link,
          "kind" -> newCourse.kind,
          "url" -> newCourse.url,
          "source" -> newCourse.source,
          "time" -> newCourse.time
        )
      )
    )

  }

  def getVideos(courseId: Int): Fu[List[Video]] = {
    coll.find(BSONDocument("courseId" -> courseId))
      .sort(BSONDocument("stt" -> 1))
      .cursor[Video]()
      .gather[List]()
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]