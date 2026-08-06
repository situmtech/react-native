#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Verificación de licencias y atribuciones — @situm/react-native  (v2)
#
# Comprueba que el paquete distribuible incluye los avisos legales exigidos
# y que el NOTICE cubre todas las dependencias nativas declaradas.
#
# USO:
#   ./verify-licencias.sh local              # tarball generado con yarn pack
#   ./verify-licencias.sh local ruta.tgz     # tarball concreto
#   ./verify-licencias.sh published 3.20.0   # lo que hay realmente en npm
#
# Devuelve 0 si todo pasa, 1 si algo falla. Apto para CI.
# ---------------------------------------------------------------------------
set -uo pipefail

MODE="${1:-local}"
ARG="${2:-}"
PKG="@situm/react-native"
FAIL=0
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; FAIL=1; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
hdr()  { printf '\n\033[1m%s\033[0m\n' "$1"; }

# ---------------------------------------------------------------------------
# 0. Localizar el repositorio y el tarball a auditar
# ---------------------------------------------------------------------------
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -z "$REPO_ROOT" ] && { echo "Ejecuta el script dentro del repositorio."; exit 1; }
PLUGIN_DIR="$REPO_ROOT/plugin"

hdr "Obteniendo el paquete a auditar"
if [ "$MODE" = "published" ]; then
  VERSION="${ARG:-latest}"
  ( cd "$WORK" && npm pack "${PKG}@${VERSION}" >/dev/null 2>&1 ) \
    || { echo "No se pudo descargar ${PKG}@${VERSION}"; exit 1; }
  TARBALL="$(ls "$WORK"/*.tgz | head -1)"
  echo "  Origen: registry npm (${PKG}@${VERSION})"
else
  if [ -n "$ARG" ]; then
    TARBALL="$(realpath "$ARG")"
  else
    # yarn pack genera SIEMPRE 'package.tgz'; npm pack usa nombre-version.tgz
    TARBALL="$(ls -t "$PLUGIN_DIR"/package.tgz "$PLUGIN_DIR"/*.tgz 2>/dev/null | head -1)"
  fi
  [ -f "${TARBALL:-}" ] || {
    echo "No hay tarball. Genera uno con:  cd plugin && yarn pack"; exit 1; }
  echo "  Origen: local  ($TARBALL)"
fi

mkdir -p "$WORK/x" && tar xzf "$TARBALL" -C "$WORK/x"
P="$WORK/x/package"
VERSION="$(node -p "require('$P/package.json').version")"
echo "  Version: $VERSION   |   ficheros: $(find "$P" -type f | wc -l)"

# ---------------------------------------------------------------------------
# 1. Avisos legales presentes en el artefacto
# ---------------------------------------------------------------------------
hdr "1. Ficheros legales en el paquete distribuido"
for f in LICENSE NOTICE.md README.md SECURITY-POLICY.md security.txt; do
  [ -f "$P/$f" ] && ok "$f" || bad "$f AUSENTE"
done

# Todo lo declarado en "files" debe existir de verdad (npm lo omite en silencio)
node -e '
const fs=require("fs"),path=require("path"),P=process.argv[1];
const pkg=JSON.parse(fs.readFileSync(path.join(P,"package.json"),"utf8"));
const miss=(pkg.files||[]).filter(p=>!p.startsWith("!")&&!p.includes("*"))
  .filter(p=>!fs.existsSync(path.join(P,p)));
if(miss.length){console.log("MISSING:"+miss.join(","));process.exit(1)}
' "$P" >"$WORK/fm" 2>/dev/null \
  && ok 'todo lo declarado en "files" está presente' \
  || bad "declarado en \"files\" pero ausente: $(sed 's/MISSING://' "$WORK/fm")"

# El build tiene que haber corrido (Yarn no ejecuta 'prepare' al publicar)
[ -d "$P/lib" ] && ok "lib/ presente (el build corrió en prepack)" \
                || bad "lib/ AUSENTE — el build no corrió; revisa el script prepack"

# ---------------------------------------------------------------------------
# 2. Contenido del NOTICE: obligaciones de la EDL-1.0 (BSD-3-Clause)
# ---------------------------------------------------------------------------
hdr "2. Contenido del NOTICE"
if [ -f "$P/NOTICE.md" ]; then
  N="$(cat "$P/NOTICE.md")"
  check() { grep -qiF "$2" <<<"$N" && ok "$1" || bad "$1"; }

  check "cita JTS"                              "jts-core"
  check "identifica la licencia elegida (EDL)"  "EDL-1.0"
  check "aviso de copyright literal de JTS"     "Vivid Solutions"
  # La EDL exige reproducir condiciones y disclaimer, no solo enlazarlos
  check "reproduce la cláusula de redistribución binaria" \
        "Redistributions in binary form"
  check "reproduce el disclaimer de garantía"   "AS IS"
  check "menciona el contenido de GeoTools"     "GeoTools"
  check "declara los términos de SitumSDK"      "SitumSDK"
else
  bad "sin NOTICE.md, no se puede validar el contenido"
fi

# ---------------------------------------------------------------------------
# 3. Deriva: toda dependencia nativa declarada debe estar en el NOTICE
#    Esto es lo que evita que el NOTICE se quede obsoleto en el futuro.
# ---------------------------------------------------------------------------
hdr "3. Cobertura del NOTICE frente a las dependencias declaradas"
GRADLE="$P/android/build.gradle"
if [ -f "$GRADLE" ] && [ -f "$P/NOTICE.md" ]; then
  # El NOTICE puede escribir el nombre con otro formato ("situm-sdk" -> "SitumSDK"),
  # así que comparamos normalizado: minúsculas y sin separadores.
  NOTICE_NORM="$(tr '[:upper:]' '[:lower:]' <"$P/NOTICE.md" | tr -d '\-._ ')"

  DEPS="$(grep -Eo "(implementation|api)[( ]+[\"'][a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+" "$GRADLE" \
          | grep -Eo "[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+" | sort -u)"

  while read -r dep; do
    [ -z "$dep" ] && continue
    art_norm="$(printf '%s' "${dep##*:}" | tr '[:upper:]' '[:lower:]' | tr -d '\-._')"
    if grep -qF "$art_norm" <<<"$NOTICE_NORM"; then
      ok "Android  $dep"
    else
      bad "Android  $dep NO aparece en el NOTICE"
    fi
  done <<<"$DEPS"
else
  warn "no se pudo comparar android/build.gradle con el NOTICE"
fi

# Dependencias del podspec (iOS)
SPEC_F="$(ls "$P"/*.podspec 2>/dev/null | head -1)"
if [ -n "$SPEC_F" ] && [ -f "$P/NOTICE.md" ]; then
  grep -Eo "s\.dependency\s+[\"'][A-Za-z0-9._-]+" "$SPEC_F" \
    | grep -Eo "[\"'][A-Za-z0-9._-]+$" | tr -d "\"'" | sort -u \
  | while read -r pod; do
      pn="$(printf '%s' "$pod" | tr '[:upper:]' '[:lower:]' | tr -d '\-._')"
      grep -qF "$pn" <<<"$NOTICE_NORM" \
        && printf '  \033[32m✓\033[0m iOS      %s\n' "$pod" \
        || printf '  \033[33m!\033[0m iOS      %s no aparece en el NOTICE\n' "$pod"
    done
fi

# Versiones del SDK nativo: el NOTICE debe reflejar las reales
for plat in android ios; do
  V=$(node -p "(require('$P/package.json').sdkVersions||{})['$plat']||''" 2>/dev/null)
  [ -z "$V" ] && continue
  grep -qF "${V%@*}" "$P/NOTICE.md" 2>/dev/null \
    && ok "SitumSDK $plat $V coincide con el NOTICE" \
    || bad "SitumSDK $plat $V NO coincide con el NOTICE (¿versión sin actualizar?)"
done

# ---------------------------------------------------------------------------
# 4. Dependencias npm: todas deben estar atribuidas en el NOTICE
# ---------------------------------------------------------------------------
hdr "4. Cobertura del NOTICE frente a las dependencias npm"
HELPER="$(dirname "$(realpath "$0")")/check-npm-notice.js"
if [ -f "$HELPER" ]; then
  node "$HELPER" "$P" || FAIL=1
else
  bad "falta check-npm-notice.js junto al script"
fi

# ---------------------------------------------------------------------------
# 5. Podspec: el atributo license debe ser hash con :type y :file
# ---------------------------------------------------------------------------
hdr "5. Podspec (iOS)"
SPEC="$(ls "$P"/*.podspec 2>/dev/null | head -1)"
if [ -n "$SPEC" ]; then
  L="$(grep -E "^\s*s\.license" "$SPEC" || true)"
  if grep -q ":file" <<<"$L" && grep -q ":type" <<<"$L"; then
    ok "s.license usa hash con :type y :file"
  else
    bad "s.license debe ser { :type => 'MIT', :file => 'LICENSE' } — actual: ${L:-ninguno}"
  fi
else
  warn "no se encontró el podspec en el tarball"
fi

# ---------------------------------------------------------------------------
# 6. Trivy: licencias detectadas y ausencia de copyleft fuerte
# ---------------------------------------------------------------------------
hdr "6. Escaneo Trivy"
if ! command -v trivy >/dev/null 2>&1; then
  TAG=$(curl -sIL -o /dev/null -w '%{url_effective}' \
        https://github.com/aquasecurity/trivy/releases/latest | sed 's|.*/tag/v||')
  ( cd "$WORK" && curl -sL \
    "https://github.com/aquasecurity/trivy/releases/download/v${TAG}/trivy_${TAG}_Linux-64bit.tar.gz" \
    | tar xz trivy )
  TRIVY="$WORK/trivy"
else
  TRIVY="$(command -v trivy)"
fi

"$TRIVY" fs --scanners license --license-full --skip-db-update \
  --format json -o "$WORK/lic.json" "$P" >/dev/null 2>&1
node -e '
const r=require(process.argv[1]);
const L=(r.Results||[]).flatMap(x=>x.Licenses||[]);
if(!L.length){console.log("NONE");process.exit(0)}
L.forEach(l=>console.log(`${l.Name}|${l.FilePath||l.PkgName||""}`));
' "$WORK/lic.json" | while IFS='|' read -r name loc; do
  [ "$name" = "NONE" ] && { echo "  ! Trivy no detectó ninguna licencia"; continue; }
  echo "  · $name  ($loc)"
done

"$TRIVY" fs --scanners license --license-full --skip-db-update \
  --severity HIGH,CRITICAL --exit-code 1 "$P" >/dev/null 2>&1 \
  && ok "sin licencias restrictivas (GPL/AGPL/LGPL)" \
  || bad "Trivy reporta licencias de severidad alta — revisar"

# ---------------------------------------------------------------------------
hdr "Resultado"
if [ "$FAIL" -eq 0 ]; then
  printf '  \033[32mAPTO\033[0m — el paquete %s cumple las comprobaciones.\n\n' "$VERSION"
else
  printf '  \033[31mNO APTO\033[0m — corrige lo marcado con ✗ antes de publicar.\n\n'
fi
exit "$FAIL"
