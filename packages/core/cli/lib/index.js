import rootCheck from "root-check";
import os from 'os';
import chalk from "chalk";
import dotenv from 'dotenv'
import path from 'path'
import { pathExistsSync} from "path-exists";
import log from "@jt-cli/log";
import pkg from '../package.json' with { type: 'json' };
import constant from './const.js';

const userHome = os.homedir();
export default core;

function core(data) {
  console.log("data", data);
  prepare();
  registerCommand();
}

function registerCommand() {}

async function prepare() {
  checkPkgVersion();
  checkRoot()
  checkUserHome()
  checkEnv()
}
function checkEnv() {
  const dotenvPath = path.resolve(userHome, ".env");
  if(pathExistsSync(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }
  createDefaultConfig()
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
function checkUserHome() {
  if (!userHome || !pathExistsSync(userHome)) {
    throw new Error(chalk.red('当前登录用户主目录不存在！'));
  }
}
function checkRoot(){
  rootCheck()
}
function checkPkgVersion() {
  log.info("cli", pkg.version);
}

