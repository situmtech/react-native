## Unreleased

### Added

- Added TextToSpeech feature for Android. Now MapView component will speak aloud any indication in case this feature is enabled.

### Fixed

- TTS on iOS will stop speaking aloud indications once the app goes to background or screen goes off. This is possible because the automatic TTS from internal MapView engine was replaced by the @situm/react-native TTS native engine.
