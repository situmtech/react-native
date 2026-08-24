#!/usr/bin/env node
/**
 * Se ejecuta como ULTIMO paso de prepack, ya con el build hecho.
 * Falla si algo declarado en "files" no existe: sin esto npm lo omite
 * en silencio y se publica un paquete incompleto.
 */
const fs = require("fs");
const path = require("path");

const PKG_DIR = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(PKG_DIR, "package.json"), "utf8"));
const isSafePackagePath = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  !path.isAbsolute(value) &&
  !path.win32.isAbsolute(value) &&
  !value.split(/[\\/]+/).includes("..");

const missing = (pkg.files || [])
  .filter(
    (p) =>
      typeof p !== "string" || (!p.startsWith("!") && !p.includes("*")),
  )
  .filter(
    (p) =>
      !isSafePackagePath(p) ||
      !fs.existsSync(
        path.join(PKG_DIR, p), // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal -- isSafePackagePath rejects absolute and parent-directory paths.
      ),
  );

if (missing.length) {
  console.error(`\n[verify-pack] ERROR: declarados en "files" pero ausentes:`);
  missing.forEach((m) => console.error(`  - ${m}`));
  console.error("\nGeneralos antes de empaquetar o quitalos de \"files\".");
  process.exit(1);
}
console.log("[verify-pack] OK: todo lo declarado en \"files\" existe");
