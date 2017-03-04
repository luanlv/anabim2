package lila.image

import akka.actor.ActorSelection
import lila.common.LightUser
import org.joda.time.DateTime

import scala.util.Success
import lila.hub.actorApi.relation.ReloadOnlineFriends
import lila.hub.actorApi.timeline.{ Propagate, Follow => FollowUser }
import play.api.libs.json.JsObject
//import lila.usrMessage.MessageRepo

final class Api(
    cached: Cached,
    actor: ActorSelection,
    bus: lila.common.Bus
) {

  private def counter = lila.counter.Env.current.api

  def newImage(filename: String, contentType: Option[String], path: String) = {
    val newData = Image(
      id = counter.getNextId("image"),
      filename = filename,
      contentType = contentType,
      path = path,
      createAt = DateTime.now()
    )

    ImageRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

}
