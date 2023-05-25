## [Unreleased]

### Changed
* Now the `subscriptionId` at `startPositioning(...)` and `stopPositioning(...)` is not needed anymore.

  > **Warning**
  > This is a breaking change as it has been modified the return type of `startPositioning` from `number` to `void` and it has been removed the parameter `subscriptionId` of `stopPositioning`.

  This change aims to simplify the use of the plugin. If you need to add multiple location listeners you just need to implement some kind of publish-subscribe pattern.