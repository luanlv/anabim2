package lila.anabim

import akka.actor._
import com.typesafe.config.Config

import lila.common.PimpedConfig._
import lila.memo.{ ExpireSetMemo, MongoCache }
import scala.concurrent.duration._

final class Env(
    config: Config,
    db: lila.db.Env,
    hub: lila.hub.Env,
    getOnlineUserIds: () => Set[String],
    lightUser: String => Option[lila.common.LightUser],
    mongoCache: MongoCache.Builder,
    scheduler: lila.common.Scheduler,
    system: ActorSystem
) {

  private val settings = new {
    val collectionCourse = config getString "collection.course"
    val collectionVideo = config getString "collection.video"
    val collectionCategory = config getString "collection.category"
    val collectionComment = config getString "collection.comment"
    val collectionSoftware = config getString "collection.software"
    val collectionSubscribe = config getString "collection.subscribe"
    val collectionPrice = config getString "collection.price"
    val collectionCoupon = config getString "collection.coupon"
    val collectionActiveCode = config getString "collection.activeCode"
    val collectionIndexCourseColl = config getString "collection.indexcourse"
    val CachedNbTtl = 10 second
  }
  import settings._
  lazy val cached = new Cached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache
  )

  lazy val api = new Api(
    cached = cached,
    actor = hub.actor.relation,
    bus = system.lilaBus
  )

  private[anabim] lazy val courseColl = db(collectionCourse)
  private[anabim] lazy val videoColl = db(collectionVideo)
  private[anabim] lazy val categoryColl = db(collectionCategory)
  private[anabim] lazy val softwareColl = db(collectionSoftware)
  private[anabim] lazy val subscribeColl = db(collectionSubscribe)
  private[anabim] lazy val priceColl = db(collectionPrice)
  private[anabim] lazy val couponColl = db(collectionCoupon)
  private[anabim] lazy val activeCodeColl = db(collectionActiveCode)
  private[anabim] lazy val commentColl = db(collectionComment)
  private[anabim] lazy val indexCourseColl = db(collectionIndexCourseColl)

}

object Env {
  lazy val current = "anabim" boot new Env(
    config = lila.common.PlayApp loadConfig "anabim",
    db = lila.db.Env.current,
    hub = lila.hub.Env.current,
    getOnlineUserIds = () => lila.user.Env.current.onlineUserIdMemo.keySet,
    lightUser = lila.user.Env.current.lightUser,
    mongoCache = lila.memo.Env.current.mongoCache,

    scheduler = lila.common.PlayApp.scheduler,
    system = lila.common.PlayApp.system
  )
}
