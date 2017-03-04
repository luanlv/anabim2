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

object IndexCourseRepo {

  private lazy val coll = Env.current.indexCourseColl

  def update(data: IndexCourse): Future[WriteResult] = {
    coll.update(
      selector = BSONDocument("_id" -> 1),
      update = BSONDocument(
        "$set" -> BSONDocument(
          "value" -> data.value
        )
      ),
      upsert = true
    )
  }

  def get = {
    coll.find(BSONDocument("_id" -> 1))
      .cursor[IndexCourse]()
      .headOption
  }

}

//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]