package lila.anabim

import reactivemongo.api.commands.WriteResult

import scala.concurrent.Future
import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json._
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import BSONHandlers._
import lila.db.BSON._
import scala.concurrent.ExecutionContext.Implicits.global
import lila.db.dsl._

object CommentRepo {

  private lazy val coll = Env.current.commentColl

  def insert(data: Comment) : Future[WriteResult] = {

    coll.insert(data)

  }

  def getComment(kind: String, id: Int) : Future[List[Comment]] = {
    coll.find(BSONDocument())
      .sort(BSONDocument("_id" -> 1))
      .cursor[Comment]()
      .gather[List]()
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]