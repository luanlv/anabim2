package lila.app
package templating

import ornicar.scalalib
import play.twirl.api.Html

import lila.api.Env.{ current => apiEnv }

object Environment
    extends scalaz.syntax.ToIdOps
    with scalaz.std.OptionInstances
    with scalaz.std.OptionFunctions
    with scalaz.std.StringInstances
    with scalaz.syntax.std.ToOptionIdOps
    with scalalib.OrnicarMonoid.Instances
    with scalalib.Zero.Instances
    with scalalib.OrnicarOption
    with lila.BooleanSteroids
    with lila.OptionSteroids
    with lila.JodaTimeSteroids
    with StringHelper
    with JsonHelper
    with AssetHelper
    with RequestHelper
    with DateHelper
    with NumberHelper
    with PaginatorHelper
    with FormHelper
    with SetupHelper
    with AiHelper
    with UserHelper
    with ForumHelper
    with I18nHelper
    with SecurityHelper
    with TeamHelper
    with AnalysisHelper
    with TournamentHelper
    with SimulHelper {

  implicit val LilaHtmlMonoid = scalaz.Monoid.instance[Html](
    (a, b) => Html(a.body + b.body),
    Html("")
  )

  type FormWithCaptcha = (play.api.data.Form[_], lila.common.Captcha)

  def netDomain = apiEnv.Net.Domain
  def netBaseUrl = apiEnv.Net.BaseUrl

  def isProd = apiEnv.isProd

  def apiVersion = lila.api.Mobile.Api.currentVersion

  def explorerEndpoint = apiEnv.ExplorerEndpoint

  def tablebaseEndpoint = apiEnv.TablebaseEndpoint

  def contactEmail = apiEnv.Net.Email

  def contactEmailLink = Html(s"""<a href="mailto:$contactEmail">$contactEmail</a>""")

  val openingBrace = "{"
  val closingBrace = "}"

  object icon {
    // val dev = Html("&#xe000;")
    val mod = Html("&#xe002;")
  }

}
