package lila.image

import lila.common.LightUser
import lila.user.LightUserApi
import lila.db.BSON
import reactivemongo.bson._
import org.joda.time.DateTime

object BSONHandlers {

  implicit val imageBSONHandler = new BSON[Image] {
    def reads(r: BSON.Reader) = {
      Image(
        id = r int "_id",
        filename = r str "filename",
        contentType = r strO "contentType",
        path = r str "path",
        createAt = r date "createAt"
      )
    }

    def writes(w: BSON.Writer, o: Image) = {
      BSONDocument(
        "_id" -> o.id,
        "filename" -> o.filename,
        "contentType" -> o.contentType,
        "path" -> o.path,
        "createAt" -> BSONDateTime.apply(o.createAt.getMillis())
      )
    }
  }

}