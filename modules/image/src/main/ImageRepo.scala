package lila.image

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

object ImageRepo {

  private lazy val coll = Env.current.imageColl

  def insert(newImage: Image): Future[WriteResult] = {
    coll.insert(newImage)
  }

  def getList(page: Int): Future[List[Image]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .skip((page - 1) * 10)
      .cursor[Image]()
      .gather[List](10)
  }

}

//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]