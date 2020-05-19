require "json"
package = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name          = "ReactNativeSitumPlugin"
  s.version       = package['version']
  s.summary       = package['description']
  s.homepage     = ""
  s.license      = "TODO"
  s.author             = { "Noman Rafique" => "nomrafique@gmail.com" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/author/situm-react-native-plugin.git", :tag => "master" }
  s.source_files  = "ios/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"

end

  