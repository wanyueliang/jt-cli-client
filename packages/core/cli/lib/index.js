import log from "@jt-cli/log";
import pkg from '../package.json' with { type: 'json' };

export default core;

function core(data) {
  console.log("data", data);
  prepare();
  registerCommand();
}

function registerCommand() {}

function prepare() {
  checkPkgVersion();
}
function checkPkgVersion() {
  log.info("cli", pkg.version);
}
