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

object ActiveCodeRepo {

  private lazy val coll = Env.current.activeCodeColl

  def insert(data: ActiveCode): Future[WriteResult] = {
    coll.insert(data)
  }

  def removeById(id: Int): Future[WriteResult] = {
    coll.remove(
      BSONDocument("_id" -> id)
    )
  }

  def decreaseQuantity(code: String): Future[WriteResult] = {
    println("giam code by 1")
    coll.update(
      BSONDocument("code" -> code),
      BSONDocument(
        "$inc" -> BSONDocument(
          "quantity" -> -1
        ),
        "$set" -> BSONDocument(
          "used" -> true
        )
      )
    )
  }

  def getActiveCodes(): Fu[List[ActiveCode]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .cursor[ActiveCode]()
      .gather[List]()
  }

  def getActiveCodeByCode(code: String): Fu[Option[ActiveCode]] = {
    coll.find(BSONDocument("code" -> code))
      .cursor[ActiveCode]()
      .headOption
  }

  def update(data: ActiveCode): Future[WriteResult] = {
    coll.update(
      BSONDocument("_id" -> data.id),
      BSONDocument(
        "$set" -> BSONDocument(
          "code" -> data.code,
          "day" -> data.day,
          "email" -> data.email,
          "all" -> data.all,
          "quantity" -> data.quantity,
          "used" -> data.used
        )
      )
    )
  }

}

//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]