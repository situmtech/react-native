## Unreleased
 
 ### Added
 
 - Added new methods to help users resolve permission and sensor-related issues within the app. With these new methods, the SDK can now automatically request the necessary permissions for positioning without the need to implement repetitive code:
    - configureUserHelper(options): Automatically detects and explains configuration problems (such as missing Location or Bluetooth permissions, or disabled sensors), and guides the user through the steps to fix them. Accepts a configuration object to customize the behavior.
    - enableUserHelper(): Shortcut to enable the user guidance with default settings
    - disableUserHelper(): Shortcut to disable the user guidance with default settings