package lila.user

import org.joda.time.DateTime

case class Info(
                    start: DateTime ,
                    end: DateTime){
}

object Info {

  case class OfficialRating(name: String, rating: Int)
  import lila.db.BSON.BSONJodaDateTimeHandler
  private[user] val infoBSONHandler = reactivemongo.bson.Macros.handler[Info]
}
