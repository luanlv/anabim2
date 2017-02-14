package lila.user

import lila.db.dsl._
import org.joda.time.DateTime

case class Note(
  _id: String,
  from: String,
  to: String,
  text: String,
  troll: Boolean,
  date: DateTime)

final class NoteApi(
    coll: Coll,
    timeline: akka.actor.ActorSelection) {

  import reactivemongo.bson._
  import lila.db.BSON.BSONJodaDateTimeHandler
  private implicit val noteBSONHandler = Macros.handler[Note]
}
