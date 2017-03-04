package lila.common

import lila.common.PimpedJson._
import org.joda.time.DateTime
import play.api.libs.json.{ Json, OWrites }

case class LightUser(
    id: String,
    name: String,
    title: Option[String],
    avatar: String,
    member: String,
    time: Option[DateTime] = None
) {

  def titleName = title.fold(name)(_ + " " + name)
  def titleNameHtml = title.fold(name)(_ + "&nbsp;" + name)
}

object LightUser {

  implicit val lightUserWrites = OWrites[LightUser] { u =>
    Json.obj(
      "id" -> u.id,
      "name" -> u.name,
      "title" -> u.title,
      "avatar" -> u.avatar,
      "member" -> u.member,
      "time" -> u.time
    )
  }

  type Getter = String => Option[LightUser]
}