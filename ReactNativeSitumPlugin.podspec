require "json"
package = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name          = "ReactNativeSitumPlugin"
  s.version       = package['version']
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  s.platform     = :ios, "8.0"
  s.source       = { :http => 'file:' + __dir__ + '/' }

  s.source_files  = "ios/*.{h,m,mm}"
  s.requires_arc = true

  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
  s.dependency "React"
  s.dependency "SitumSDK", package['sdkVersions']["ios"]

end
