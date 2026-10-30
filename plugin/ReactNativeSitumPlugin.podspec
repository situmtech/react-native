require "json"
require_relative "ios/situm_spm"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

unless respond_to?(:spm_dependency, true)
  raise Pod::Informative, "[Situm] The iOS SDK requires React Native 0.75 or later, which provides spm_dependency."
end

Pod::Spec.new do |s|
  s.name         = SitumSPM::POD_NAME
  s.version      = package['version']
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license = { :type => 'MIT', :file => 'LICENSE' }
  s.preserve_paths = "NOTICE.md"
  s.authors      = package["author"]
  s.platform     = :ios, "16.0"
  s.source       = { :http => 'file:' + __dir__ + '/' }

  s.source_files  = "ios/*.{h,m,mm}"
  s.requires_arc = true
  # Keeps the Objective-C code of the static ZipArchive library when the pod is a dynamic framework.
  s.pod_target_xcconfig = { "OTHER_LDFLAGS" => "$(inherited) -ObjC" }

  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  end
  s.dependency "React"
  SitumSPM.configure(s, method(:spm_dependency), package["sdkVersions"]["ios"])

end
