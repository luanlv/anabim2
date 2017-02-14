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

object SoftwareRepo {

  private lazy val coll = Env.current.softwareColl

  def removeById(softID: Int): Future[WriteResult] = {
    coll.remove(BSONDocument("_id" -> softID))
  }

  def insert(data: Software): Future[WriteResult] = {
    coll.insert(data)
  }



  //
  def update(data: Software): Future[WriteResult] = {

    coll.update(
      BSONDocument("_id" -> data.id),
      BSONDocument(
        "$set" -> BSONDocument(
          "name" -> data.name,
          "cover" -> BSONDocument(
            "_id" -> data.cover.id,
            "filename" -> data.cover.filename,
            "contentType" -> data.cover.contentType,
            "path" -> data.cover.path,
            "createAt" -> BSONDateTime(data.cover.createAt.getMillis)
          ),
          "slug" -> data.slug
        )
      )
    )
  }

  def getSofts(page: Int, nb: Int = 100): Fu[List[Software]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .skip((page-1)*nb)
      .cursor[Software]()
      .gather[List](nb)
  }

  def getSoftById(id: Int) = {
    coll.find(BSONDocument("_id" -> id))
      .cursor[Software]()
      .headOption
  }

  def allSofs(): Fu[List[Software]] = {
    coll.find(BSONDocument())
      .cursor[Software]()
      .gather[List]()
  }

  def getBySlug(slug: String) = {
    coll.find(BSONDocument("slug" -> slug))
      .cursor[Software]()
      .headOption
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]