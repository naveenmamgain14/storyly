pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Storyly Demo"
include(":app")
include(":storyly")

// Include the SDK module from parent directory
project(":storyly").projectDir = File("../android-sdk/storyly")
