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

# Archiving fails when the pod folder and the shared folder both have the signature of an xcframework.
if [ "${ACTION}" = "install" ] && [ "${CONFIGURATION_BUILD_DIR}" != "${PODS_CONFIGURATION_BUILD_DIR}" ]; then
    for signature in "${CONFIGURATION_BUILD_DIR}"/*.xcframework-*.signature; do
        if [ -f "${PODS_CONFIGURATION_BUILD_DIR}/${signature##*/}" ]; then
            rm -f "${signature}"
        fi
    done
fi
