package controllers

import lila.app._
import lila.hub.actorApi.{ GetUids, GetUserIds }
import lila.user.{ Cached, UserRepo, User => UserModel }
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.http.ContentTypes
import play.api.libs.concurrent.Promise
import play.api.libs.json.{ JsArray, JsObject, JsString, Json }
import play.api.mvc._
import views.html.helper.form

import scala.annotation.tailrec
import scala.concurrent.Future
import scala.concurrent.duration._
import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions
import com.ybrikman.ping.scalaapi.bigpipe._
import com.ybrikman.ping.scalaapi.bigpipe.HtmlStreamImplicits._
import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions._
import views.html

import scala.concurrent.ExecutionContext
import lila.anabim.{ CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo, IndexCourseRepo }

object Application extends LilaController {

  private def env = lila.app.Env.current
  private def envSecurity = Env.security
  private def api = envSecurity.api

  def index = Open { implicit ctx =>
    IndexCourseRepo.get map {
      indexCourses => Ok(views.html.index.home(Json.toJson(indexCourses).toString))
    }

  }

  def adminLogin = Open { implicit ctx =>
    ctx.me match {
      case Some(user) => {
        if (user.roles.contains("admin")) {
          Redirect(routes.Application.admin()).fuccess
        } else {
          Ok(views.html.admin.login(api.loginForm)).fuccess
        }
      }
      case None =>
        Ok(views.html.admin.login(api.loginForm)).fuccess
    }
  }

  def admin = Open { implicit ctx =>
    ctx.me match {
      case None => {
        Redirect(routes.Application.adminLogin()).fuccess
      }
      case Some(user) =>
        if (user.roles.contains("admin")) {
          Ok(views.html.admin.index()).fuccess
        } else {
          Redirect(routes.Application.adminLogin()).fuccess
        }
    }
  }

  def post(postId: String) = Open { implicit ctx =>
    Ok(views.html.index.home()).fuccess
  }

  def json = Open { implicit ctx =>
    val fuJson = Future(Json.obj("data" -> "data recieved from sever!!!"))
    val fuJsonDelay: Future[JsObject] = Promise.timeout(fuJson, 0 second).flatMap(x => x)
    fuJsonDelay.map {
      data => Ok(data)
    }
  }

  def user(user: String) = Open { implicit ctx =>
    Ok(views.html.index.home()).fuccess
  }

  def userMini(user: String) = Open { implicit ctx =>
    lila.app.Env.user.lightUserApi.get(user) match {
      case None => Ok("").fuccess
      case Some(lightUser) => {
        Ok("<div>" + lightUser.name + "</div>").fuccess
      }
    }
  }

}
