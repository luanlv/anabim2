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

object PriceRepo {

  private lazy val coll = Env.current.priceColl


  def update(price: Price): Future[WriteResult] = {
    coll.update(
      selector = BSONDocument("_id" -> 1),
      update = BSONDocument(
        "$set" -> BSONDocument(
          "one" -> price.one,
          "three" -> price.three,
          "six" -> price.six,
          "twelve" -> price.twelve
        )
      ),
      upsert = true
    )
  }

  def get = {
     coll.find(BSONDocument("_id" -> 1))
      .cursor[Price]()
      .headOption
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]