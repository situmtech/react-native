// Expo config plugin: Situm Maven repository on Android and dynamic frameworks warning on iOS.
const {
  withGradleProperties,
  withPodfileProperties,
} = require("expo/config-plugins");

const EXTRA_MAVEN_REPOS_PROPERTY = "android.extraMavenRepos";
const SITUM_MAVEN_REPOSITORY =
  "https://repo.situm.com/artifactory/libs-release-local";

const withSitumMavenRepository = (config) =>
  withGradleProperties(config, (config) => {
    // config.modResults contains all the lines from the generated gradle.properties file as a list of objects.
    // Find the property that defines the Maven repositories so the Situm repository can be added later.
    const extraMavenReposProperty = config.modResults.find(
      (item) =>
        item.type === "property" && item.key === EXTRA_MAVEN_REPOS_PROPERTY,
    );

    let repositories = [];

    if (extraMavenReposProperty) {
      // extraMavenReposProperty.value contains the list of Maven repositories as a JSON string, so we must
      // convert that string back into an array before inspecting or modifying it.
      try {
        repositories = JSON.parse(extraMavenReposProperty.value);
      } catch {
        console.warn(
          `[Situm] We could not automatically add ${SITUM_MAVEN_REPOSITORY} ` +
            `to your Maven repositories because ${EXTRA_MAVEN_REPOS_PROPERTY} contains invalid JSON. ` +
            "You will need to add it manually.",
        );
        return config;
      }

      // Defensive check in case extraMavenReposProperty.value stops being an array in a future update.
      if (!Array.isArray(repositories)) {
        console.warn(
          `[Situm] We could not automatically add ${SITUM_MAVEN_REPOSITORY} ` +
            `to your Maven repositories because ${EXTRA_MAVEN_REPOS_PROPERTY} is not a JSON array. ` +
            "You will need to add it manually.",
        );
        return config;
      }
    }

    // Check whether the Situm repository is already configured. Expo accepts each repository as
    // either a URL string or an object containing a url field, so we check for both cases.
    const hasSitumRepository = repositories.some((repository) => {
      const url =
        typeof repository === "string" ? repository : repository?.url;

      return url === SITUM_MAVEN_REPOSITORY;
    });

    if (!hasSitumRepository) {
      repositories.push({ url: SITUM_MAVEN_REPOSITORY });
    }

    // Convert the list of repositories back to a string.
    const value = JSON.stringify(repositories);

    if (extraMavenReposProperty) {
      // If the property already exists, update it with the Situm repository.
      extraMavenReposProperty.value = value;
    } else {
      // If the property does not yet exist, create it with the Situm repository inside.
      config.modResults.push({
        type: "property",
        key: EXTRA_MAVEN_REPOS_PROPERTY,
        value,
      });
    }

    return config;
  });

// Warns when the pods are not built as dynamic frameworks. ZipArchive, a dependency of the iOS SDK, is compiled
// on the integrator's machine, so we need it to be a dynamic framework to find it.
const withSitumDynamicFrameworksWarning = (config) =>
  withPodfileProperties(config, (config) => {
    const USE_FRAMEWORKS_PROPERTY = "ios.useFrameworks";
    if (config.modResults[USE_FRAMEWORKS_PROPERTY] !== "dynamic") {
      console.warn(
        "[Situm] On iOS, the Situm SDK requires dynamic frameworks without precompiled modules. Enable them with either:\n" +
          '- expo-build-properties in app.json: "ios": { "useFrameworks": "dynamic", "usePrecompiledModules": false }\n' +
          '- ios/Podfile.properties.json, edited by hand: "ios.useFrameworks": "dynamic", "EXPO_USE_PRECOMPILED_MODULES": "false"',
      );
    }

    return config;
  });

const withSitum = (config) => {
  config = withSitumMavenRepository(config);
  config = withSitumDynamicFrameworksWarning(config);
  return config;
};

module.exports = withSitum;
