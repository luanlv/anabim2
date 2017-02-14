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

object SubscribeRepo {

  private lazy val coll = Env.current.subscribeColl


  def insert(data: Subscribe): Future[WriteResult] = {
    coll.insert(data)
  }

  def findByUserId(userId: String) = {
    coll.find(BSONDocument("email" -> userId))
      .cursor[Subscribe]()
      .headOption
  }

  def removeByUserId(userId: String) = {
    coll.remove(BSONDocument("email" -> userId))
  }


  def getSubs(page: Int, nb: Int = 100): Fu[List[Subscribe]] = {
    coll.find(BSONDocument("done" -> false))
      .sort(BSONDocument("_id" -> -1))
      .skip((page-1)*nb)
      .cursor[Subscribe]()
      .gather[List](nb)
  }
  def getDoneSubs(page: Int, nb: Int = 100): Fu[List[Subscribe]] = {
    coll.find(BSONDocument("done" -> true))
      .sort(BSONDocument("_id" -> -1))
      .skip((page-1)*nb)
      .cursor[Subscribe]()
      .gather[List](nb)
  }

  def agree(id: Int) = {
    coll.update(
      BSONDocument("_id" -> id),
      BSONDocument(
        "$set" -> BSONDocument(
          "done" -> true,
          "state" -> "Đồng ý"
        )
      )
    )
  }

  def reject(id: Int) = {
    coll.update(
      BSONDocument("_id" -> id),
      BSONDocument(
        "$set" -> BSONDocument(
          "done" -> true,
          "state" -> "Không đồng ý"
        )
      )
    )
  }
}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]