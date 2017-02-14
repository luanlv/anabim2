package controllers

import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.mvc._
import play.twirl.api.Html
import lila.api.Context
import lila.app._
import lila.relation.Related
import lila.user.{UserRepo, User => UserModel}
import lila.anabim.{CourseRepo, VideoRepo, CateRepo, SoftwareRepo, SubscribeRepo, PriceRepo, IndexCourseRepo}
import views._


object Admin extends LilaController {

  private def env = Env.anabim.api

  def newCourse = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>

    val req = ctx.body
    ctx.me match {
      case Some(user) => {

        val course = Json.parse(req.body.toString).as[JsObject]

        env.newCourse(course) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {

        BadRequest.fuccess
      }

    }
  }

  def newCate = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>

    val req = ctx.body
    ctx.me match {
      case Some(user) => {

        val cate = Json.parse(req.body.toString).as[JsObject]

        env.newCate(cate) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {

        BadRequest.fuccess
      }

    }
  }

  def deleteCate = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>

    val req = ctx.body
    ctx.me match {
      case Some(user) => {

        val cateID = (Json.parse(req.body.toString).as[JsObject] \ "id").as[Int]

        env.deleteCate(cateID) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {

        BadRequest.fuccess
      }

    }
  }

  def getVideos(courseId: Int) = Open { implicit ctx =>
    VideoRepo.getVideos(courseId) map {
      videos => Ok(Json.toJson(videos))
    }
  }

  def newVideo = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val video = Json.parse(req.body.toString).as[JsObject]
        env.newVideo(video) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def deleteVideo = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val videoID = (Json.parse(req.body.toString).as[JsObject] \ "id").as[Int]
        env.deleteVideo(videoID) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def editVideo = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val video = Json.parse(req.body.toString).as[JsObject]
        env.editVideo(video) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def editCourse(id: Int) = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val course = Json.parse(req.body.toString).as[JsObject]
        env.editCourse(course) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }


  def editCate(id: Int) = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val cate = Json.parse(req.body.toString).as[JsObject]
        env.editCate(cate) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def updateEndDate = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val data = Json.parse(req.body.toString).as[JsObject]
        env.updateEndDate(data) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def getMembershipUsers = Open { implicit ctx =>
    UserRepo.getMembershipUsers(1) map {
      users => Ok(Json.toJson(users.map{
        user => Json.obj(
          "email" -> user.email,
          "name" -> user.name,
          "role" -> user.roles,
          "member" -> user.member,
          "time" -> user.time,
          "createdAt" -> user.createdAt,
          "member" -> user.member,
          "info" -> Json.obj(
            "start" -> user.info.get.start,
            "end" -> user.info.get.end
          )
        )
      }))
    }
  }

  def getCourses = Open { implicit ctx =>
    CourseRepo.getCourse(1) map {
      courses => Ok(Json.toJson(courses))
    }
  }

  def getCourseById(courseId: Int) = Open { implicit ctx =>
    CourseRepo.getCourseById(courseId) map {
      course => Ok(Json.toJson(course))
    }
  }

  def getCates = Open { implicit ctx =>
    CateRepo.getCates(1) map {
      cates => Ok(Json.toJson(cates))
    }
  }

  def getCateById(courseId: Int) = Open { implicit ctx =>
    CateRepo.getCateById(courseId) map {
      cate => Ok(Json.toJson(cate))
    }
  }


  def newSoft = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>

    val req = ctx.body
    ctx.me match {
      case Some(user) => {

        val soft = Json.parse(req.body.toString).as[JsObject]

        env.newSoft(soft) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {

        BadRequest.fuccess
      }

    }
  }

  def deleteSoft = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>

    val req = ctx.body
    ctx.me match {
      case Some(user) => {

        val softID = (Json.parse(req.body.toString).as[JsObject] \ "id").as[Int]

        env.deleteSoft(softID) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {

        BadRequest.fuccess
      }

    }
  }

  def editSoft(id: Int) = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val soft = Json.parse(req.body.toString).as[JsObject]
        env.editSoft(soft) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }

    }
  }

  def getSofts = Open { implicit ctx =>
    SoftwareRepo.getSofts(1) map {
      softs => Ok(Json.toJson(softs))
    }
  }

  def getSoftById(courseId: Int) = Open { implicit ctx =>
    SoftwareRepo.getSoftById(courseId) map {
      soft => Ok(Json.toJson(soft))
    }
  }


  def getSubs = Open { implicit ctx =>
    SubscribeRepo.getSubs(1) map {
      subs => Ok(Json.toJson(subs))
    }
  }
  def getDoneSubs = Open { implicit ctx =>
    SubscribeRepo.getDoneSubs(1) map {
      subs => Ok(Json.toJson(subs))
    }
  }

  def action = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val action = Json.parse(req.body.toString).as[JsObject]
        env.action(action)
        Ok("ok").fuccess
      }
      case None => {
        BadRequest.fuccess
      }
    }
  }
  def getPrice = Open { implicit ctx =>
    PriceRepo.get map {
      price => Ok(Json.toJson(price))
    }
  }

  def setPrice = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val price = Json.parse(req.body.toString).as[JsObject]
        env.price(price) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }
    }
  }

  def getIndexCourses = Open { implicit ctx =>
    IndexCourseRepo.get map {
      indexCourse => Ok(Json.toJson(indexCourse))
    }
  }

  def updateIndexCourses = OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    val req = ctx.body
    ctx.me match {
      case Some(user) => {
        val indexCourse = Json.parse(req.body.toString).as[JsObject]
        env.indexCourse(indexCourse) map {
          result =>
            if(result >=0 ) {
              Ok(result)
            } else {
              BadRequest
            }
        }
      }
      case None => {
        BadRequest.fuccess
      }
    }
  }

}
