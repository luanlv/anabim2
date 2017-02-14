package controllers

import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.mvc._
import play.twirl.api.Html
import lila.api.Context
import lila.app._
import lila.relation.Related
import lila.user.{UserRepo, User => UserModel}
import lila.anabim.{CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo}
import views._


object Course extends LilaController {

  private def env = Env.anabim.api

  def index(slug: String) = Open { implicit  ctx =>
    for {
      course <- CourseRepo.getCourseBySlug(slug)
      courses <- CourseRepo.getRelatedCourse(course.get.cateID)
      videos <- VideoRepo.getVideos(course.get.id)
    } yield {
      course match {
        case Some(course) => Ok(views.html.index.course(Json.toJson(course).toString, Json.toJson(videos).toString, Json.toJson(courses).toString ))
        case _ => Redirect("/")
      }
    }
  }

  def index2(courseSlug: String, videoSlug: String) = index(courseSlug)

  def categoryIndex(cateSlug: String) = Open { implicit  ctx =>
    for {
      category <- CateRepo.getCateBySlug(cateSlug)
      courses <- CourseRepo.getCourseByCateID(category.get.id)
    } yield {
      category match {
        case Some(category) => Ok(views.html.index.category(Json.toJson(category).toString, Json.toJson(courses).toString))
        case _ => Redirect("/")
      }
    }
  }

  def softwareIndex(softwareSlug: String) = Open { implicit  ctx =>
    for {
      software <- SoftwareRepo.getBySlug(softwareSlug)
      courses <- CourseRepo.getCourseBySoftID(software.get.id)
    } yield {
      software match {
        case Some(software) => Ok(views.html.index.software(Json.toJson(software).toString, Json.toJson(courses).toString))
        case _ => Redirect("/")
      }
    }
  }

}
