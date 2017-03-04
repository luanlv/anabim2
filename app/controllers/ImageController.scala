package controllers

import play.api.libs.json.{ JsArray, JsObject, Json }
import play.api.mvc._
import play.twirl.api.Html
import lila.api.Context
import lila.app._
import lila.relation.Related
import lila.user.{ UserRepo, User => UserModel }
import lila.image.{ ImageRepo }
import lila.image.{ Image => ImageModel }
import views._
import java.util.UUID

object ImageController extends LilaController {

  private def env = Env.image.api

  def upload = Action.async(parse.multipartFormData) { request =>
    val uuid = UUID.randomUUID().toString
    request.body.file("file_data").map { picture =>
      import java.io.File
      val filename = picture.filename
      val contentType = picture.contentType
      val path = s"_image/$uuid.jpg"
      picture.ref.moveTo(new File(path))
      env.newImage(filename, contentType, s"$uuid.jpg") map {
        result =>
          if (result >= 0) {
            Ok(Json.obj("status" -> "File uploaded!"))
          } else {
            BadRequest
          }
      }

    }.getOrElse {
      Ok(Json.obj("error" -> "You are not allowed to upload such a file.")).fuccess
    }
  }

  def getList(page: Int) = Open { implicit ctx =>
    ImageRepo.getList(page) map {
      imgs => Ok(Json.toJson(imgs))
    }
  }

  def get(id: String) = Action {
    val file = new java.io.File("_image/" + id)
    Ok.sendFile(
      file,
      inline = true
    )
  }

}
