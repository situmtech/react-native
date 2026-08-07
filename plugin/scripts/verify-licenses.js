#!/usr/bin/env node
/** Verifica las licencias y atribuciones del tarball de @situm/react-native. */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const PACKAGE_NAME = "@situm/react-native";
const LEGAL_FILES = [
  "LICENSE",
  "NOTICE.md",
  "README.md",
  "SECURITY-POLICY.md",
  "security.txt",
];
const NOTICE_REQUIREMENTS = [
  ["cita JTS", "jts-core"],
  ["identifica la licencia elegida (EDL)", "EDL-1.0"],
  ["aviso de copyright literal de JTS", "Vivid Solutions"],
  [
    "reproduce la cláusula de redistribución binaria",
    "Redistributions in binary form",
  ],
  ["reproduce el disclaimer de garantía", "AS IS"],
  ["menciona el contenido de GeoTools", "GeoTools"],
  ["declara los términos de SitumSDK", "SitumSDK"],
];

let failed = false;
const color = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
};
const ok = (message) =>
  console.log(`  ${color.green}✓${color.reset} ${message}`);
const bad = (message) => {
  console.log(`  ${color.red}✗${color.reset} ${message}`);
  failed = true;
};
const warn = (message) =>
  console.log(`  ${color.yellow}!${color.reset} ${message}`);
const header = (message) =>
  console.log(`\n${color.bold}${message}${color.reset}`);
const normalize = (value) => value.toLowerCase().replace(/[\s._-]/g, "");
const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

function repositoryRoot() {
  try {
    return run("git", ["rev-parse", "--show-toplevel"]).trim();
  } catch {
    throw new Error("Ejecuta el script dentro del repositorio.");
  }
}

function latestTarball(directory) {
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".tgz"))
    .map((name) => path.join(directory, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

function packageToAudit(root, workDirectory, mode, argument) {
  if (mode === "published") {
    const version = argument || "latest";
    try {
      run("npm", ["pack", `${PACKAGE_NAME}@${version}`], {
        cwd: workDirectory,
      });
    } catch {
      throw new Error(`No se pudo descargar ${PACKAGE_NAME}@${version}`);
    }
    const tarball = latestTarball(workDirectory);
    if (!tarball)
      throw new Error(
        `npm no generó un tarball para ${PACKAGE_NAME}@${version}`,
      );
    console.log(`  Origen: registry npm (${PACKAGE_NAME}@${version})`);
    return tarball;
  }

  const tarball = argument
    ? path.resolve(argument)
    : latestTarball(path.join(root, "plugin"));
  if (!tarball || !fs.existsSync(tarball)) {
    throw new Error("No hay tarball. Genera uno con: cd plugin && yarn pack");
  }
  console.log(`  Origen: local (${tarball})`);
  return tarball;
}

function extractPackage(tarball, workDirectory) {
  const extractDirectory = path.join(workDirectory, "extract");
  fs.mkdirSync(extractDirectory);
  run("tar", ["xzf", tarball, "-C", extractDirectory]);
  const packageDirectory = path.join(extractDirectory, "package");
  if (!fs.existsSync(path.join(packageDirectory, "package.json"))) {
    throw new Error("El tarball no contiene package/package.json");
  }
  return packageDirectory;
}

function validatePackageFiles(packageDirectory, packageJson) {
  header("1. Ficheros legales en el paquete distribuido");
  for (const file of LEGAL_FILES) {
    fs.existsSync(path.join(packageDirectory, file))
      ? ok(file)
      : bad(`${file} AUSENTE`);
  }

  const missing = (packageJson.files || []).filter(
    (file) =>
      !file.startsWith("!") &&
      !file.includes("*") &&
      !fs.existsSync(path.join(packageDirectory, file)),
  );
  missing.length
    ? bad(`declarado en "files" pero ausente: ${missing.join(", ")}`)
    : ok('todo lo declarado en "files" está presente');

  fs.existsSync(path.join(packageDirectory, "lib"))
    ? ok("lib/ presente (el build corrió en prepack)")
    : bad("lib/ AUSENTE — el build no corrió; revisa el script prepack");
}

function validateNotice(packageDirectory) {
  header("2. Contenido del NOTICE");
  const noticePath = path.join(packageDirectory, "NOTICE.md");
  if (!fs.existsSync(noticePath)) {
    bad("sin NOTICE.md, no se puede validar el contenido");
    return null;
  }
  const notice = fs.readFileSync(noticePath, "utf8");
  for (const [description, requiredText] of NOTICE_REQUIREMENTS) {
    notice.toLowerCase().includes(requiredText.toLowerCase())
      ? ok(description)
      : bad(description);
  }
  return notice;
}

function validateNativeDependencies(packageDirectory, packageJson, notice) {
  header("3. Cobertura del NOTICE frente a las dependencias declaradas");
  if (!notice) {
    warn("no se pudo comparar las dependencias nativas con el NOTICE");
    return;
  }
  const normalizedNotice = normalize(notice);
  const gradlePath = path.join(packageDirectory, "android", "build.gradle");
  if (fs.existsSync(gradlePath)) {
    const dependencies = [
      ...fs
        .readFileSync(gradlePath, "utf8")
        .matchAll(/(?:implementation|api)[(\s]+["']([\w.-]+):([\w.-]+)/g),
    ]
      .map(([, group, artifact]) => `${group}:${artifact}`)
      .filter(
        (dependency, index, dependencies) =>
          dependencies.indexOf(dependency) === index,
      );
    for (const dependency of dependencies) {
      normalizedNotice.includes(normalize(dependency.split(":").pop()))
        ? ok(`Android  ${dependency}`)
        : bad(`Android  ${dependency} NO aparece en el NOTICE`);
    }
  } else {
    warn("no se encontró android/build.gradle en el tarball");
  }

  const podspec = fs
    .readdirSync(packageDirectory)
    .find((file) => file.endsWith(".podspec"));
  if (podspec) {
    const dependencies = [
      ...fs
        .readFileSync(path.join(packageDirectory, podspec), "utf8")
        .matchAll(/s\.dependency\s+["']([\w.-]+)/g),
    ].map(([, dependency]) => dependency);
    for (const dependency of dependencies) {
      normalizedNotice.includes(normalize(dependency))
        ? ok(`iOS      ${dependency}`)
        : warn(`iOS      ${dependency} no aparece en el NOTICE`);
    }
  }

  for (const platform of ["android", "ios"]) {
    const version = packageJson.sdkVersions?.[platform];
    if (!version) continue;
    notice.includes(version.replace(/@.*$/, ""))
      ? ok(`SitumSDK ${platform} ${version} coincide con el NOTICE`)
      : bad(
          `SitumSDK ${platform} ${version} NO coincide con el NOTICE (¿versión sin actualizar?)`,
        );
  }
}

function validateNpmDependencies(packageDirectory) {
  header("4. Cobertura del NOTICE frente a las dependencias npm");
  try {
    run(
      process.execPath,
      [path.join(__dirname, "check-npm-notice.js"), packageDirectory],
      { stdio: "inherit" },
    );
  } catch {
    failed = true;
  }
}

function validateTrivy(packageDirectory) {
  header("5. Escaneo Trivy");

  try {
    const report = JSON.parse(
      run("trivy", [
        "fs",
        "--scanners",
        "license",
        "--license-full",
        "--skip-db-update",
        "--format",
        "json",
        packageDirectory,
      ]),
    );
    const licenses = (report.Results || []).flatMap(
      (result) => result.Licenses || [],
    );
    for (const license of licenses) {
      console.log(
        `  . ${license.Name}  (${license.FilePath || license.PkgName || ""})`,
      );
    }

    if (licenses.some((license) => ["HIGH", "CRITICAL"].includes(license.Severity))) {
      bad("Trivy reporta licencias de severidad alta o critica; revisar");
    } else {
      ok("sin licencias de severidad alta o critica");
    }
  } catch {
    throw new Error(
      "No se pudo ejecutar el analisis de licencias con Trivy. Comprueba que este instalado, que su base de datos este disponible y que pueda analizar el paquete.",
    );
  }
}

const [mode = "local", argument = ""] = process.argv.slice(2);
if (!["local", "published"].includes(mode)) {
  console.error(
    "uso: verify-licenses.js [local [ruta.tgz] | published [versión]]",
  );
  process.exit(2);
}

const workDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "situm-license-"));
try {
  const root = repositoryRoot();
  header("Obteniendo el paquete a auditar");
  const tarball = packageToAudit(root, workDirectory, mode, argument);
  const packageDirectory = extractPackage(tarball, workDirectory);
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(packageDirectory, "package.json"), "utf8"),
  );
  console.log(`  Version: ${packageJson.version}`);

  validatePackageFiles(packageDirectory, packageJson);
  const notice = validateNotice(packageDirectory);
  validateNativeDependencies(packageDirectory, packageJson, notice);
  validateNpmDependencies(packageDirectory);
  validateTrivy(packageDirectory);

  header("Resultado");
  console.log(
    failed
      ? `  ${color.red}NO APTO${color.reset} — corrige lo marcado con ✗ antes de publicar.\n`
      : `  ${color.green}APTO${color.reset} — el paquete ${packageJson.version} cumple las comprobaciones.\n`,
  );
  process.exitCode = failed ? 1 : 0;
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  fs.rmSync(workDirectory, { recursive: true, force: true });
}
