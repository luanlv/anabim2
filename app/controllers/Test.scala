package controllers

import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.mvc._
import play.twirl.api.Html
import lila.api.Context
import lila.app._
import lila.relation.Related
import lila.user.{UserRepo, User => UserModel}
import views._


object Test extends LilaController {

  def index = Open { implicit  ctx =>
    Ok(views.html.test()).fuccess
  }

  def test2= Open { implicit ctx =>
    Ok(Json.obj("result" -> "ok")).fuccess
  }
}
