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

object Software extends LilaController {

  private def env = Env.anabim.api

  def index(slug: String) = Open { implicit ctx =>
    for {
      course <- CourseRepo.getCourseBySlug(slug)
      courses <- CourseRepo.getRelatedCourse(course.get.cateID)
      videos <- VideoRepo.getVideos(course.get.id)
    } yield {
      course match {
        case Some(course) => Ok(views.html.index.course(Json.toJson(course).toString, Json.toJson(videos).toString, Json.toJson(courses).toString))
        case _ => Redirect("/")
      }
    }
  }

}
