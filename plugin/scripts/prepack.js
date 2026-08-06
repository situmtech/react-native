#!/usr/bin/env node
/**
 * Copia los ficheros legales/de documentacion que viven en la raiz del monorepo
 * dentro de plugin/ para que npm los incluya en el tarball.
 *
 * Se ejecuta automaticamente en `yarn pack`, `yarn npm publish` y `npm pack`.
 * postpack.js deshace la copia.
 */
const fs = require("fs");
const path = require("path");

const PKG_DIR = path.resolve(__dirname, "..");
const ROOT_DIR = path.resolve(PKG_DIR, "..");
const MANIFEST = path.join(PKG_DIR, ".packed-root-files.json");

// Ficheros que deben viajar en el tarball pero viven en la raiz del monorepo.
const FILES = ["README.md", "LICENSE", "SECURITY-POLICY.md", "security.txt"];

const copied = [];
const missing = [];

for (const name of FILES) {
  const src = path.join(ROOT_DIR, name);
  const dest = path.join(PKG_DIR, name);

  if (!fs.existsSync(src)) {
    missing.push(name);
    continue;
  }
  // No pisar un fichero que ya exista de forma legitima en plugin/.
  if (fs.existsSync(dest)) {
    console.log(`[prepack] ${name}: ya existe en plugin/, se respeta`);
    continue;
  }
  fs.copyFileSync(src, dest);
  copied.push(name);
  console.log(`[prepack] ${name}: copiado desde la raiz`);
}

if (missing.length) {
  console.error(
    `\n[prepack] ERROR: no se encontraron en la raiz del monorepo: ${missing.join(", ")}`
  );
  process.exit(1);
}

// Registrar SOLO lo que hemos copiado, para que postpack no borre nada ajeno.
fs.writeFileSync(MANIFEST, JSON.stringify(copied));

console.log("[prepack] ficheros de raiz listos");
