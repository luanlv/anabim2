package controllers

import play.api.data._
import Forms._
import play.api.i18n.Messages.Implicits._
import play.api.libs.json._
import play.api.mvc._
import Results._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import play.api.Play.current
import lila.api.Context
import lila.app._
import lila.common.{HTTPRequest, LilaCookie}
import lila.user.{UserRepo, User => UserModel}
import models.User
import views._

import scala.concurrent.Future


object Auth extends LilaController {


  private def env = Env.security
  private def api = env.api
  private def forms = env.forms

  private def mobileUserOk(u: UserModel): Fu[Result] =
    Future{
      Ok {
        Env.user.jsonView(u) ++ Json.obj(
          "nowPlaying" -> JsArray())
      }
    }


  private def authenticateUser(u: UserModel)(implicit ctx: Context): Fu[Result] = {
    implicit val req = ctx.req
    api.saveAuthentication(u.id, ctx.mobileApiVersion) flatMap { sessionId =>
      negotiate(
        html = Redirect {
          get("referrer").filter(_.nonEmpty) orElse req.session.get(api.AccessUri) getOrElse "/" //routes.Lobby.home.url
        }.fuccess,
        api = _ => mobileUserOk(u)
      ) map {
        _ withCookies LilaCookie.withSession { session =>
          session + ("sessionId" -> sessionId) - api.AccessUri
        }
      }
    } recoverWith authRecovery
  }


  private def authRecovery(implicit ctx: Context): PartialFunction[Throwable, Fu[Result]] = {
    case lila.security.Api.MustConfirmEmail(userId) => UserRepo byId userId map {
      case Some(user) => BadRequest(html.auth.checkYourEmail(user))
      case None       => BadRequest
    }
  }

  def login = Open { implicit ctx =>
    val referrer = get("referrer") orElse {
      getBool("autoref") ?? HTTPRequest.referer(ctx.req)
    }
    val form = get("form")
    form match {
      case None =>     Ok(views.html.index.home()).fuccess
      case Some(form) => Ok(html.auth.login(api.loginForm, referrer)).fuccess
    }
  }



  def authenticate = OpenBody { implicit ctx =>
    implicit val req = ctx.body
    val referrer = get("referrer")
    api.usernameForm.bindFromRequest.fold(
      err => negotiate(
        html = Unauthorized(html.index.home()).fuccess,
        api = _ => Unauthorized(errorsAsJson(err)).fuccess
      ),
      username => api.loadLoginForm(username) flatMap { loginForm =>
        loginForm.bindFromRequest.fold(
          err => negotiate(
            html = Unauthorized(html.index.home()).fuccess,
            api = _ => Unauthorized(errorsAsJson(err)).fuccess
          ), {
            case None    => InternalServerError("Authentication error").fuccess
            case Some(u) => authenticateUser(u)
          })
      })
  }

  def logout = Open { implicit ctx =>
    implicit val req = ctx.req
    val referrer = get("referrer").filter(_.nonEmpty) getOrElse "/"
    req.session get "sessionId" foreach lila.security.Store.delete
    negotiate(
//      html = fuccess(Redirect(routes.Main.mobile)),
      html = fuccess(Redirect(referrer)),
      api = apiVersion => Ok(Json.obj("ok" -> true)).fuccess
    ) map (_ withCookies LilaCookie.newSession)
  }

  def signup = Open { implicit ctx =>
    NoTor {
      Ok(html.auth.signup2(forms.signup.website)).fuccess
    }
  }


//
//  private def doSignup(username: String, password: String, rawEmail: Option[String])(implicit ctx: Context): Fu[(UserModel, Option[String])] = {
//    val email = rawEmail.map(e => env.emailAddress.validate(e) err s"Invalid email $e")
//    UserRepo.create(username, password, email, "", ctx.blindMode, ctx.mobileApiVersion)
//      .flatten(s"No user could be created for ${username}")
//      .map(_ -> email)
//  }

  def signupPost = OpenBody { implicit ctx =>
    implicit val req = ctx.body
    forms.signup.signupForm.bindFromRequest.fold(
      err => BadRequest(html.auth.signup2(err)).fuccess,
      data => {
        val email = env.emailAddress.validate(data.email) err s"Invalid email ${data.email}"
        UserRepo.create(email, data.password, data.name, email.some, "", ctx.blindMode, none,
          mustConfirmEmail = false)
          .flatten(s"No user could be created for ${data.email}")
          .map(_ -> email).flatMap {
          case (user, email) => {
            env.emailConfirm.send(user, email)
            redirectNewUser(user)
          }
        }
      }
    )
  }

  def checkYourEmail(name: String) = Open { implicit ctx =>
    OptionOk(UserRepo named name) { user =>
      html.auth.checkYourEmail(user)
    }
  }

  def signupConfirmEmail(token: String) = Open { implicit ctx =>
    Env.security.emailConfirm.confirm(token) flatMap {
      case None =>
        lila.mon.user.register.confirmEmailResult(false)()
        notFound
      case Some(user) =>
        lila.mon.user.register.confirmEmailResult(true)()
        redirectNewUser(user)
    }
  }

  private def redirectNewUser(user: UserModel)(implicit ctx: Context) = {
    implicit val req = ctx.req
    api.saveAuthentication(user.id, ctx.mobileApiVersion) map { sessionId =>
      Redirect("/") withCookies LilaCookie.session("sessionId", sessionId)
    } recoverWith authRecovery
  }

  private def noTorResponse(implicit ctx: Context) = negotiate(
    html = Unauthorized(html.auth.tor()).fuccess,
    api = _ => Unauthorized(jsonError("Can't login from Tor, sorry!")).fuccess)

  def setFingerprint(fp: String, ms: Int) = Auth { ctx =>
    me =>
      api.setFingerprint(ctx.req, fp) flatMap {
        _ ?? { hash =>
            api.recentUserIdsByFingerprint(hash).map(_.filter(me.id!=)) flatMap {
              case _ => funit
            }
        }
      } inject Ok
  }


  def passwordReset = Open { implicit ctx =>
    forms.passwordResetWithCaptcha map {
      case (form, captcha) => Ok(html.auth.passwordReset(form, captcha))
    }
  }

  def passwordResetApply = OpenBody { implicit ctx =>
    implicit val req = ctx.body
    forms.passwordReset.bindFromRequest.fold(
      err => forms.anyCaptcha map { captcha =>
        BadRequest(html.auth.passwordReset(err, captcha, false.some))
      },
      data => {
        val email = env.emailAddress.validate(data.email) | data.email
        UserRepo enabledByEmail email flatMap {
          case Some(user) =>
            Env.security.passwordReset.send(user, email) inject Redirect(routes.Auth.passwordResetSent(data.email))
          case _ => forms.passwordResetWithCaptcha map {
            case (form, captcha) => BadRequest(html.auth.passwordReset(form, captcha, false.some))
          }
        }
      }
    )
  }

  def passwordResetSent(email: String) = Open { implicit ctx =>
    fuccess {
      Ok(html.auth.passwordResetSent(email))
    }
  }

  def passwordResetConfirm(token: String) = Open { implicit ctx =>
    Env.security.passwordReset confirm token flatMap {
      case Some(user) =>
        fuccess(html.auth.passwordResetConfirm(user, token, forms.passwdReset, none))
      case _ => notFound
    }
  }

  def passwordResetConfirmApply(token: String) = OpenBody { implicit ctx =>
    Env.security.passwordReset confirm token flatMap {
      case Some(user) =>
        implicit val req = ctx.body
        FormFuResult(forms.passwdReset) { err =>
          fuccess(html.auth.passwordResetConfirm(user, token, err, false.some))
        } { data =>
          UserRepo.passwd(user.id, data.newPasswd1) >> authenticateUser(user)
        }
      case _ => notFound
    }
  }

}
