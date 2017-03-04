package lila.anabim

import akka.actor.ActorSelection
import lila.common.LightUser
import org.joda.time.DateTime

import scala.util.Success
import lila.hub.actorApi.relation.ReloadOnlineFriends
import lila.hub.actorApi.timeline.{ Propagate, Follow => FollowUser }
import lila.image.Image
import play.api.libs.json.JsObject

import scala.concurrent.Future
//import lila.usrMessage.MessageRepo
import lila.user.UserRepo

final class Api(
    cached: Cached,
    actor: ActorSelection,
    bus: lila.common.Bus
) {

  private def counter = lila.counter.Env.current.api

  def deleteVideo(videoID: Int) = {
    VideoRepo.removeById(videoID) map {
      result =>
        if (result.ok) {
          videoID
        } else {
          -1
        }
    }
  }

  def deleteCoupon(data: JsObject) = {
    val id = (data \ "id").as[Int]
    CouponRepo.removeById(id) map {
      result =>
        if (result.ok) {
          id
        } else {
          -1
        }
    }
  }

  def deleteActiveCode(data: JsObject) = {
    val id = (data \ "id").as[Int]
    ActiveCodeRepo.removeById(id) map {
      result =>
        if (result.ok) {
          id
        } else {
          -1
        }
    }
  }

  def newVideo(data: JsObject) = {
    val newData = Video(
      id = counter.getNextId("video"),
      stt = (data \ "stt").as[Double],
      courseId = (data \ "courseId").as[Int],
      section = (data \ "section").as[Int],
      name = (data \ "name").as[String],
      link = (data \ "link").as[String],
      kind = (data \ "kind").as[String],
      url = (data \ "url").as[String],
      source = (data \ "source").as[String],
      time = (data \ "time").as[Int]
    )

    VideoRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def editVideo(data: JsObject) = {
    val newData = Video(
      id = (data \ "id").as[Int],
      stt = (data \ "stt").as[Double],
      courseId = (data \ "courseId").as[Int],
      section = (data \ "section").as[Int],
      name = (data \ "name").as[String],
      link = (data \ "link").as[String],
      kind = (data \ "kind").as[String],
      url = (data \ "url").as[String],
      source = (data \ "source").as[String],
      time = (data \ "time").as[Int]
    )
    VideoRepo.update(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def newCourse(data: JsObject) = {
    val newData = Course(
      id = counter.getNextId("course"),
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String],
      cateID = (data \ "cateID").as[List[Int]],
      softID = (data \ "softID").as[List[Int]],
      level = (data \ "level").as[Int],
      author = (data \ "author").as[String],
      section = (data \ "section").as[List[String]],
      description = (data \ "description").as[String],
      documents = (data \ "documents").asOpt[String],
      related = (data \ "related").asOpt[List[Int]]
    )
    CourseRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def updateCoupon(data: JsObject) = {
    println(data)
    val updatedData = Coupon(
      id = (data \ "id").as[Int],
      kind = (data \ "kind").as[Int],
      code = (data \ "code").as[String],
      price = (data \ "price").asOpt[Int],
      percent = (data \ "percent").asOpt[Int],
      day = (data \ "day").asOpt[Int],
      month = (data \ "month").as[List[Int]],
      quantity = (data \ "quantity").as[Int],
      active = (data \ "active").as[Boolean],
      endTime = new DateTime((data \ "endTime").as[Long])
    )
    println(updatedData)
    CouponRepo.update(updatedData) map {
      result =>
        if (result.ok) {
          updatedData.id
        } else {
          1
        }
    }
  }

  def updateActiveCode(data: JsObject) = {
    println(data)
    val updatedData = ActiveCode(
      id = (data \ "id").as[Int],
      code = (data \ "code").as[String],
      day = (data \ "day").as[Int],
      email = (data \ "email").as[String],
      all = (data \ "all").as[Boolean],
      quantity = (data \ "quantity").as[Int],
      used = (data \ "used").as[Boolean]
    )
    ActiveCodeRepo.update(updatedData) map {
      result =>
        if (result.ok) {
          updatedData.id
        } else {
          1
        }
    }
  }

  def newCoupon(data: JsObject) = {
    val newData = Coupon(
      id = counter.getNextId("coupon"),
      kind = (data \ "kind").as[Int],
      code = (data \ "code").as[String],
      price = (data \ "price").asOpt[Int],
      percent = (data \ "percent").asOpt[Int],
      day = (data \ "day").asOpt[Int],
      month = (data \ "month").as[List[Int]],
      quantity = (data \ "quantity").as[Int],
      endTime = new DateTime((data \ "endTime").as[Long])
    )
    CouponRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def newActiveCode(data: JsObject) = {
    val newData = ActiveCode(
      id = counter.getNextId("activecode"),
      code = (data \ "code").as[String],
      day = (data \ "day").as[Int],
      email = (data \ "email").as[String],
      all = (data \ "all").as[Boolean],
      quantity = (data \ "quantity").as[Int],
      used = (data \ "used").as[Boolean]
    )
    ActiveCodeRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def editCourse(data: JsObject) = {
    println(data)
    val newData = Course(
      id = (data \ "id").as[Int],
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String],
      cateID = (data \ "cateID").as[List[Int]],
      softID = (data \ "softID").as[List[Int]],
      level = (data \ "level").as[Int],
      author = (data \ "author").as[String],
      section = (data \ "section").as[List[String]],
      description = (data \ "description").as[String],
      documents = (data \ "documents").asOpt[String],
      related = (data \ "related").asOpt[List[Int]]
    )

    CourseRepo.update(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def getCourse(page: Int) = {
    CourseRepo.getCourse(1)
  }

  def deleteCate(cateID: Int) = {
    CateRepo.removeById(cateID: Int) map {
      result =>
        if (result.ok) {
          cateID
        } else {
          -1
        }
    }
  }

  def newCate(data: JsObject) = {
    val newData = Cate(
      id = counter.getNextId("cate"),
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String],
      description = (data \ "description").as[String]
    )
    CateRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def updateEndDate(data: JsObject) = {
    val email = (data \ "email").as[String]
    val endDate = (data \ "date").as[Long]
    val newDate = new DateTime(endDate)
    UserRepo.updateEndDate(email, newDate)
    Future(1)
  }

  def editCate(data: JsObject) = {
    val newData = Cate(
      id = (data \ "id").as[Int],
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String],
      description = (data \ "description").as[String]
    )

    CateRepo.update(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def deleteSoft(softID: Int) = {
    SoftwareRepo.removeById(softID) map {
      result =>
        if (result.ok) {
          softID
        } else {
          -1
        }
    }
  }
  def newSoft(data: JsObject) = {
    val newData = Software(
      id = counter.getNextId("soft"),
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String]
    )
    SoftwareRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def editSoft(data: JsObject) = {

    val newData = Software(
      id = (data \ "id").as[Int],
      name = (data \ "name").as[String],
      cover = (data \ "cover").as[Image],
      slug = (data \ "slug").as[String]
    )

    SoftwareRepo.update(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def comment(data: JsObject, email: String) = {
    val newData = Comment(
      id = counter.getNextId("subscrible"),
      kind = (data \ "kind").as[String],
      parentID = (data \ "parentID").as[Int],
      comment = (data \ "comment").as[String],
      user = lila.user.Env.current.lightUserApi.get(email).get,
      time = DateTime.now()
    )
    CommentRepo.insert(newData) map {
      result =>
        if (result.ok) {
          newData.id
        } else {
          -1
        }
    }
  }

  def newSubscribe(data: JsObject, email: String, name: String) = {
    val newData = Subscribe(
      id = counter.getNextId("subscrible"),
      done = false,
      state = "Đang duyệt",
      email = email,
      name = name,
      phone = (data \ "phone").as[String],
      month = (data \ "month").as[Int],
      bonusDay = (data \ "bonusDay").as[Int],
      price = (data \ "price").as[Int],
      info = (data \ "info").as[String],
      coupon = (data \ "coupon").asOpt[Coupon],
      createAt = DateTime.now()
    )

    SubscribeRepo.insert(newData) map {
      result =>
        if (result.ok) {
          if (newData.coupon.isDefined) {
            CouponRepo.decreaseQuantity(newData.coupon.get.code)
          }
          UserRepo.updateMember(email, "pending")
          newData.id
        } else {
          -1
        }
    }
  }

  def activeByCode(code: String, email: String, name: String) = {
    ActiveCodeRepo.getActiveCodeByCode(code) map { codeO =>
      {
        codeO match {
          case None => -1
          case Some(code) => {
            if (code.all && code.quantity > 0 || code.email == email) {
              println(" code ok !!!")
              ActiveCodeRepo.decreaseQuantity(code.code)
              UserRepo.trialMember(email, code.day)
              1
            } else {
              -1
            }
          }
        }
      }
    }
  }

  def unSubscribe(email: String) = {
    SubscribeRepo.removeByUserId(email) map {
      result =>
        if (result.ok) {
          UserRepo.updateMember(email, "none")
          1
        } else {
          -1
        }
    }
  }

  def action(data: JsObject) = {
    val action = (data \ "action").as[Boolean]
    val subId = (data \ "id").as[Int]
    if (action) {
      val userId = (data \ "email").as[String]
      val month = (data \ "month").as[Int]

      SubscribeRepo.agree(subId)
      UserRepo.newSub(userId, month)
    } else {
      SubscribeRepo.reject(subId)
    }
  }

  def price(data: JsObject) = {
    val newPrice = Price(
      one = (data \ "one").as[Int],
      three = (data \ "three").as[Int],
      six = (data \ "six").as[Int],
      twelve = (data \ "twelve").as[Int]
    )
    PriceRepo.update(newPrice) map {
      result =>
        if (result.ok) {
          1
        } else {
          -1
        }
    }
  }

  def indexCourse(data: JsObject) = {
    val newData = IndexCourse(
      value = (data \ "value").as[List[CateWithCourses]]
    )
    IndexCourseRepo.update(newData) map {
      result =>
        if (result.ok) {
          1
        } else {
          -1
        }
    }
  }
}
