// Expo config plugin that adds the Situm Maven repository to Android projects.
const { AndroidConfig } = require("expo/config-plugins");

const SITUM_MAVEN_REPOSITORY =
  "https://repo.situm.com/artifactory/libs-release-local";
const { createBuildGradlePropsConfigPlugin } = AndroidConfig.BuildProperties;

module.exports = createBuildGradlePropsConfigPlugin(
  [
    {
      propName: "android.extraMavenRepos",
      propValueGetter: () => JSON.stringify([{ url: SITUM_MAVEN_REPOSITORY }]),
    },
  ],
  "withSitumMavenRepository",
);
