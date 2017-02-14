package lila.image

import akka.actor._
import com.typesafe.config.Config

import lila.common.PimpedConfig._
import lila.memo.{ExpireSetMemo, MongoCache}
import scala.concurrent.duration._

final class Env(
                 config: Config,
                 db: lila.db.Env,
                 hub: lila.hub.Env,
                 getOnlineUserIds: () => Set[String],
                 lightUser: String => Option[lila.common.LightUser],
                 mongoCache: MongoCache.Builder,
                 scheduler: lila.common.Scheduler,
                 system: ActorSystem) {

  private val settings = new {
    val collectionImage = config getString "collection.image"
    val CachedNbTtl = 10 second
  }
  import settings._
  lazy val cached = new Cached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache)

  lazy val api = new Api(
    cached = cached,
    actor = hub.actor.relation,
    bus = system.lilaBus)


  private[image] lazy val imageColl = db(collectionImage)

}

object Env {
  lazy val current = "image" boot new Env(
    config = lila.common.PlayApp loadConfig "image",
    db = lila.db.Env.current,
    hub = lila.hub.Env.current,
    getOnlineUserIds = () => lila.user.Env.current.onlineUserIdMemo.keySet,
    lightUser = lila.user.Env.current.lightUser,
    mongoCache = lila.memo.Env.current.mongoCache,

    scheduler = lila.common.PlayApp.scheduler,
    system = lila.common.PlayApp.system)
}
