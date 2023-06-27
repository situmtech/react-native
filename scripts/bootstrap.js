import { spawnSync } from "child_process";
import { type } from "os";
import { resolve } from "path";

const root = resolve(__dirname, "..");
const args = process.argv.slice(2);
const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  encoding: "utf-8"
};

if (type() === "Windows_NT") {
  options.shell = true;
}

let result;

if (process.cwd() !== root || args.length) {
  // We're not in the root of the project, or additional arguments were passed
  // In this case, forward the command to `yarn`
  result = spawnSync("yarn", args, options);
} else {
  // If `yarn` is run without arguments, perform bootstrap
  result = spawnSync("yarn", ["bootstrap"], options);
}

process.exitCode = result.status;
