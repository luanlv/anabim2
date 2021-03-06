resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

resolvers += "Atlassian Releases" at "https://maven.atlassian.com/public/"

resolvers += Resolver.jcenterRepo

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.4.6")

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.6.0")