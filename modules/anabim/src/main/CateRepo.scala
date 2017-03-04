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

object CateRepo {

  private lazy val coll = Env.current.categoryColl

  def removeById(cateID: Int): Future[WriteResult] = {
    coll.remove(BSONDocument("_id" -> cateID))
  }

  def insert(newCate: Cate): Future[WriteResult] = {
    coll.insert(newCate)
  }

  def update(newCourse: Cate): Future[WriteResult] = {

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
          "description" -> newCourse.description
        )
      )
    )
  }

  def getCates(page: Int, nb: Int = 100): Fu[List[Cate]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .skip((page - 1) * nb)
      .cursor[Cate]()
      .gather[List](nb)
  }

  def allCates(): Fu[List[Cate]] = {
    coll.find(BSONDocument())
      .cursor[Cate]()
      .gather[List]()
  }

  def getCateById(cateId: Int) = {
    coll.find(BSONDocument("_id" -> cateId))
      .cursor[Cate]()
      .headOption
  }

  def getCateBySlug(slug: String) = {
    coll.find(BSONDocument("slug" -> slug))
      .cursor[Cate]()
      .headOption
  }

}

//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]