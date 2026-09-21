// Expo config plugin that adds the Situm Maven repository to Android projects.
const { WarningAggregator, withProjectBuildGradle } = require('expo/config-plugins')

const SITUM_MAVEN_REPOSITORY = 'https://repo.situm.com/artifactory/libs-release-local'
const SITUM_MAVEN_REPOSITORY_BLOCK = `

allprojects {
    repositories {
        maven { url "${SITUM_MAVEN_REPOSITORY}" }
    }
}
`;

const withSitumMavenRepository = expoConfig =>
  withProjectBuildGradle(expoConfig, gradleConfig => {
    if (gradleConfig.modResults.language !== 'groovy') {
      // Warn instead of adding Groovy syntax to an unsupported Gradle format.
      WarningAggregator.addWarningAndroid(
        'withSitumMavenRepository',
        'Cannot automatically configure project build.gradle if it is not Groovy'
      )

      return gradleConfig
    }

    // Avoid adding the repository if it is already configured.
    if (!gradleConfig.modResults.contents.includes(SITUM_MAVEN_REPOSITORY)) {
      gradleConfig.modResults.contents += SITUM_MAVEN_REPOSITORY_BLOCK;
    }

    return gradleConfig
  })

module.exports = withSitumMavenRepository
