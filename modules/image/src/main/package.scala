package lila

package object image extends PackageObject with WithPlay {

  private[image] type ID = String

  object tube {
    // expose user tube
    //    implicit lazy val listMenuTube = ListMenu.tube inColl Env.current.listMenuColl
    //    implicit lazy val listViewTube = ListView.tube inColl Env.current.listMenuColl
  }

}
