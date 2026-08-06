#!/usr/bin/env node
/** Elimina unicamente los ficheros que prepack.js copio. */
const fs = require("fs");
const path = require("path");

const PKG_DIR = path.resolve(__dirname, "..");
const MANIFEST = path.join(PKG_DIR, ".packed-root-files.json");

if (!fs.existsSync(MANIFEST)) process.exit(0);

for (const name of JSON.parse(fs.readFileSync(MANIFEST, "utf8"))) {
  const target = path.join(PKG_DIR, name);
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    console.log(`[postpack] ${name}: limpiado`);
  }
}
fs.unlinkSync(MANIFEST);
