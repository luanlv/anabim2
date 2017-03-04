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

object CouponRepo {

  private lazy val coll = Env.current.couponColl

  def insert(data: Coupon): Future[WriteResult] = {
    coll.insert(data)
  }

  def removeById(id: Int): Future[WriteResult] = {
    coll.remove(
      BSONDocument("_id" -> id)
    )
  }

  def decreaseQuantity(code: String): Future[WriteResult] = {
    coll.update(
      BSONDocument("code" -> code),
      BSONDocument(
        "$inc" -> BSONDocument(
          "quantity" -> -1
        )
      )
    )
  }

  def getCoupons(): Fu[List[Coupon]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> -1))
      .cursor[Coupon]()
      .gather[List]()
  }

  def getCouponByCode(code: String): Fu[Option[Coupon]] = {
    coll.find(BSONDocument("code" -> code))
      .cursor[Coupon]()
      .headOption
  }

  def update(data: Coupon): Future[WriteResult] = {
    coll.update(
      BSONDocument("_id" -> data.id),
      BSONDocument(
        "$set" -> BSONDocument(
          "kind" -> data.kind,
          "code" -> data.code,
          "price" -> data.price,
          "percent" -> data.percent,
          "day" -> data.day,
          "month" -> data.month,
          "quantity" -> data.quantity,
          "active" -> data.active,
          "endTime" -> BSONDateTime(data.endTime.getMillis)
        )
      )
    )
  }

}

//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]