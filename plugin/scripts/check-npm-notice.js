#!/usr/bin/env node
/**
 * check-npm-notice.js
 *
 * Comprueba que TODA dependency y peerDependency del paquete distribuido
 * aparece mencionada en NOTICE.md, y resuelve su licencia contra el registry
 * de npm para poder mostrarla y detectar copyleft.
 *
 * Uso:  node check-npm-notice.js <ruta-al-paquete-extraido>
 * Sale con 1 si falta alguna atribucion.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const P = process.argv[2];
if (!P) {
  console.error("uso: check-npm-notice.js <dir-paquete>");
  process.exit(2);
}

const G = (s) => `\x1b[32m✓\x1b[0m ${s}`;
const R = (s) => `\x1b[31m✗\x1b[0m ${s}`;
const Y = (s) => `\x1b[33m!\x1b[0m ${s}`;

const pkg = JSON.parse(fs.readFileSync(path.join(P, "package.json"), "utf8"));
const noticePath = path.join(P, "NOTICE.md");

if (!fs.existsSync(noticePath)) {
  console.log("  " + R("no hay NOTICE.md que comprobar"));
  process.exit(1);
}
const notice = fs.readFileSync(noticePath, "utf8");

// ---------------------------------------------------------------------------
// Nombres ya cubiertos por el NOTICE.
// Se extraen de forma estructurada (primera celda de cada fila de tabla y
// cualquier span entre backticks) y se comparan por igualdad exacta tras
// normalizar. Un `includes` suelto daria falsos negativos: "react" esta
// contenido en "reactnativewebview" y taparia una dependencia sin declarar.
// ---------------------------------------------------------------------------
const norm = (s) => s.toLowerCase().replace(/[\s._@/-]/g, "");
const covered = new Set();

for (const line of notice.split("\n")) {
  const t = line.trim();
  if (t.startsWith("|")) {
    const cell = t.split("|")[1];
    if (!cell) continue;
    if (/^\s*-+\s*$/.test(cell)) continue; // separador de tabla
    // "JTS Topology Suite (`org.locationtech.jts:jts-core`)" -> ambas formas
    covered.add(norm(cell.replace(/`[^`]*`/g, "")));
    for (const m of cell.matchAll(/`([^`]+)`/g)) {
      covered.add(norm(m[1]));
      covered.add(norm(m[1].split(":").pop()));
    }
  }
  for (const m of t.matchAll(/`([^`]+)`/g)) covered.add(norm(m[1]));
}
covered.delete("");

// ---------------------------------------------------------------------------
// Resolver la licencia declarada en el registry
// ---------------------------------------------------------------------------
let registryUp = true;
function licenseOf(name, range) {
  try {
    const raw = execFileSync(
      "npm",
      ["view", `${name}@${range}`, "license", "--json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 30000 }
    ).trim();
    if (!raw) return null;
    const v = JSON.parse(raw);
    // Un rango que casa varias versiones devuelve un array: la ultima es la mayor.
    if (Array.isArray(v)) return v.filter(Boolean).pop() || null;
    return typeof v === "object" ? v.license || null : v;
  } catch {
    registryUp = false;
    return null;
  }
}

// Copyleft: no basta con nombrarlo en el NOTICE, exige revision.
const COPYLEFT = /(^|[^A-Za-z])(GPL|AGPL|LGPL|MPL|EPL|CDDL|CPL|OSL|EUPL)([-0-9.]|$)/i;

// ---------------------------------------------------------------------------
const deps = [
  ...Object.entries(pkg.dependencies || {}).map(([n, r]) => [n, r, "dependency"]),
  ...Object.entries(pkg.peerDependencies || {}).map(([n, r]) => [n, r, "peerDependency"]),
].sort((a, b) => a[0].localeCompare(b[0]));

if (!deps.length) {
  console.log("  " + Y("el paquete no declara dependencies ni peerDependencies"));
  process.exit(0);
}

let fail = 0;
for (const [name, range, kind] of deps) {
  const lic = licenseOf(name, range);
  const licTxt = lic || "licencia NO resuelta";
  const inNotice = covered.has(norm(name));
  const label = `${name}@${range}  [${kind}]  ${licTxt}`;

  if (!inNotice) {
    console.log("  " + R(`${label} — NO aparece en NOTICE.md`));
    fail = 1;
    continue;
  }
  if (!lic) {
    console.log("  " + Y(`${label} — mencionado, pero verifica la licencia a mano`));
    continue;
  }
  if (COPYLEFT.test(lic)) {
    console.log("  " + R(`${label} — copyleft: requiere revision legal`));
    fail = 1;
    continue;
  }
  console.log("  " + G(label));
}

// Al reves: algo declarado en el NOTICE que ya no es dependencia.
const declared = new Set(deps.map(([n]) => norm(n)));
const known = new Set(["react", "reactnative", "reactnativewebview", "reactdom"]);
for (const c of covered) {
  if (known.has(c) && !declared.has(c)) {
    console.log("  " + Y(`NOTICE.md menciona "${c}" pero ya no es dependencia`));
  }
}

if (!registryUp) {
  console.log(
    "  " + Y("no se pudo consultar el registry de npm; licencias sin verificar")
  );
}

process.exit(fail);
