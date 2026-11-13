# Links SitumSDK.framework where the embed phase copies it from, and removes duplicate signatures when archiving.
set -eu
framework_name="${SITUM_SDK_FRAMEWORK_PATH##*/}"

# Xcode builds the framework in one of these folders, depending on the pod linkage and on the build action.
rm -f "${SITUM_SDK_FRAMEWORK_PATH}"
for dir in "${PODS_CONFIGURATION_BUILD_DIR}" "${PODS_CONFIGURATION_BUILD_DIR}/PackageFrameworks" \
    "${OBJROOT}/UninstalledProducts/${PLATFORM_NAME}"; do
    if [ -d "${dir}/${framework_name}" ]; then
        mkdir -p "$(dirname "${SITUM_SDK_FRAMEWORK_PATH}")"
        ln -s "${dir}/${framework_name}" "${SITUM_SDK_FRAMEWORK_PATH}"
        break
    fi
done
if [ ! -e "${SITUM_SDK_FRAMEWORK_PATH}" ]; then
    echo "error: [Situm] ${framework_name} was not found in the build products."
    exit 1
fi

# CocoaPods sets CONFIGURATION_BUILD_DIR to ${PODS_CONFIGURATION_BUILD_DIR}/<pod name> in the xcconfig of each pod
# target, so that each pod builds in its own folder. In this phase, which runs in this pod's target,
# CONFIGURATION_BUILD_DIR is this pod's folder. Xcode writes the signature of each prebuilt xcframework of the Swift
# packages linked to this pod both there and in the shared PODS_CONFIGURATION_BUILD_DIR, and archiving fails on the
# duplicate. Only this pod's copy is removed, so the archive keeps the shared one. Nothing is removed if this pod
# already builds in the shared folder for any reason, such as a CocoaPods change or bug, because then there is only
# one copy.
if [ "${ACTION}" = "install" ] && [ "${CONFIGURATION_BUILD_DIR}" != "${PODS_CONFIGURATION_BUILD_DIR}" ]; then
    for signature in "${CONFIGURATION_BUILD_DIR}"/*.xcframework-*.signature; do
        if [ -f "${PODS_CONFIGURATION_BUILD_DIR}/${signature##*/}" ]; then
            rm -f "${signature}"
        fi
    done
fi
