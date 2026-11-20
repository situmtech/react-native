# React Native's spm_dependency only works properly with static frameworks in earlier versions.
# Until it is fixed in every version this plugin supports, this script applies a patch that solves it.
module SitumSPM
  POD_NAME = "ReactNativeSitumPlugin".freeze
  PRODUCT = "SitumSDK".freeze
  # The build phase links the framework here, so the embed phase finds it wherever Xcode builds it.
  FRAMEWORK_PATH = "${PODS_CONFIGURATION_BUILD_DIR}/#{POD_NAME}-SPM/#{PRODUCT}.framework".freeze
  BUILD_PHASE_NAME = "[Situm] Prepare #{PRODUCT} for embedding".freeze

  class << self
    attr_reader :react_native_embeds_sdk

    def configure(spec)
      # Checks whether this React Native version already fixed that bug: if its spm_dependency accepts
      # embed_frameworks, React Native embeds the frameworks itself and this file does nothing.
      @react_native_embeds_sdk = method(:spm_dependency).parameters.any? { |_kind, name| name == :embed_frameworks }
      return if react_native_embeds_sdk

      build_phase_script = File.read(File.join(__dir__, "situm_spm_build_phase.sh"))
      spec.script_phase = {
        name: BUILD_PHASE_NAME,
        execution_position: :after_compile,
        always_out_of_date: "1",
        script: %(SITUM_SDK_FRAMEWORK_PATH="#{FRAMEWORK_PATH}"\n#{build_phase_script}),
      }
    end
  end

  module Embedding
    def framework_paths_by_config
      paths_by_config = super
      plugin = pod_targets.find { |pod| pod.pod_name == SitumSPM::POD_NAME }
      return paths_by_config if plugin.nil? || SitumSPM.react_native_embeds_sdk || requires_host_target?

      paths_by_config.to_h do |configuration, paths|
        next [configuration, paths] unless pod_targets_for_build_configuration(configuration).include?(plugin)

        [configuration, paths + [Pod::Xcode::FrameworkPaths.new(SitumSPM::FRAMEWORK_PATH)]]
      end
    end
  end
end

# The module is prepended once, also when require loads this file through two different paths.
Pod::AggregateTarget.prepend(SitumSPM::Embedding) unless Pod::AggregateTarget.ancestors.include?(SitumSPM::Embedding)
