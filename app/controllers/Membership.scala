package controllers

import play.api.libs.json.{ JsArray, JsObject, Json }
import play.api.mvc._
import play.twirl.api.Html
import lila.api.Context
import lila.app._
import lila.relation.Related
import lila.user.{ UserRepo, User => UserModel }
import lila.anabim.{ CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo }
import views._

object Membership extends LilaController {

  private def env = Env.anabim.api

  def subscribe = AuthBody(BodyParsers.parse.tolerantJson) { implicit ctx => me => {
    val data = Json.parse(ctx.body.body.toString).as[JsObject]
    env.newSubscribe(data, me.id, me.name) map {
      result =>
        if (result >= 0) {
          Ok(result)
        } else {
          BadRequest
        }
    }
  }
  }

  def activeByCode(code: String) = AuthBody(BodyParsers.parse.tolerantJson) { implicit ctx => me => {
    val data = Json.parse(ctx.body.body.toString).as[JsObject]
    env.activeByCode(code, me.id, me.name) map {
      result =>
        if (result >= 0) {
          Ok(result)
        } else {
          BadRequest
        }
    }
  }
  }

  def reSubscribe = AuthBody { implicit ctx => me => {
    env.unSubscribe(me.id) map {
      result =>
        if (result >= 0) {
          Redirect("/")
        } else {
          BadRequest
        }
    }
  }
  }

  def getInfo = AuthBody { implicit ctx => me => {
    if (me.member == "pending") {
      SubscribeRepo.findByUserId(me.id).map {
        subscribeOp =>
          subscribeOp match {
            case Some(subscribe) => Ok(views.html.membership.pending(subscribe))
            case _ => BadRequest
          }
      }
    } else if (me.member == "membership") {
      Ok(views.html.membership.membership(me)).fuccess
    } else if (me.member == "trial") {
      Ok(views.html.membership.trial(me.info.get.end.toDate)).fuccess
    } else {
      Ok("last").fuccess
    }
  }
  }

}
