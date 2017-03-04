package controllers

import org.joda.time.DateTime
import play.api.data._, Forms._
import play.api.i18n.Messages.Implicits._
import play.api.libs.json._
import play.api.mvc._, Results._
import play.api.Play.current
import lila.anabim.{ CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo, PriceRepo, IndexCourseRepo }

import lila.api.Context
import lila.app._
import lila.common.{ LilaCookie, HTTPRequest }
import lila.user.{ UserRepo, User => UserModel }
import views._
import scala.concurrent.Future
import scala.util.{ Failure, Success }
import scala.concurrent.ExecutionContext.Implicits.global

object UserActivity extends LilaController {
  private def env = Env.anabim.api

  def comment = AuthBody(BodyParsers.parse.tolerantJson) { implicit ctx => me => {
    val data = Json.parse(ctx.body.body.toString).as[JsObject]
    env.comment(data, me.id) map {
      result =>
        if (result >= 0) {
          Ok(result)
        } else {
          BadRequest
        }
    }
  }
  }

}
