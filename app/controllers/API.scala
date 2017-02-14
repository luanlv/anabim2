package controllers

import org.joda.time.DateTime
import play.api.data._, Forms._
import play.api.i18n.Messages.Implicits._
import play.api.libs.json._
import play.api.mvc._, Results._
import play.api.Play.current
import lila.anabim.{CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo, PriceRepo, IndexCourseRepo, CommentRepo}

import lila.api.Context
import lila.app._
import lila.common.{ LilaCookie, HTTPRequest }
import lila.user.{ UserRepo, User => UserModel }
import views._
import scala.concurrent.Future
import scala.util.{ Failure, Success }
import scala.concurrent.ExecutionContext.Implicits.global


object API extends LilaController {
  private def env = Env.anabim.api

  def getCourseBySlug(slug: String) = Open { implicit ctx =>
    for {
      course <- CourseRepo.getCourseBySlug(slug)
      videos <- VideoRepo.getVideos(course.get.id)
    } yield {
      Ok(Json.obj(
        "videos" -> Json.toJson(videos),
        "course" -> Json.toJson(course)
        )
      )
    }

  }

  def getCoursesByCateSlug(cateSlug: String) = Open { implicit ctx =>
    for {
      category <- CateRepo.getCateBySlug(cateSlug)
      courses <- CourseRepo.getCourseByCateID(category.get.id)
    } yield {
      Ok(Json.obj(
        "category" -> Json.toJson(category),
        "courses" -> Json.toJson(courses)
      )
      )
    }
  }

  def getCategories() = Open { implicit ctx =>
    CateRepo.allCates() map {
      cates => Ok(Json.toJson(cates))
    }
  }

  def getCourses() = Open { implicit ctx =>
    CourseRepo.getAll() map {
      courses => Ok(Json.toJson(courses))
    }
  }

  def getIndexCourse() = Open { implicit ctx =>
    IndexCourseRepo.get map {
      indexCourse => Ok(Json.toJson(indexCourse))
    }
  }


  def getComment(kind: String, id: Int) = Open { implicit ctx =>
    CommentRepo.getComment(kind, id) map {
      comments => Ok(Json.toJson(comments))
    }
  }
}
