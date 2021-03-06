package lila.anabim

import scala.concurrent.Future
import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.JsObject
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.BSON._
import lila.memo.{ ExpireSetMemo, MongoCache }

final class Cached(
    nbTtl: FiniteDuration,
    mongoCache: MongoCache.Builder
) {

  private def oneWeekAgo = DateTime.now minusWeeks 1

  private val cache: Cache[Int] = LruCache(timeToLive = 1 hour)
  private val cacheVersion: Cache[Map[Int, String]] = LruCache(timeToLive = 5 minute, maxCapacity = 100000)

  def clearCache(pre: String, uid: String) = cache.remove(pre + uid)

}