import rootCheck from "root-check";
import os from 'os';
import chalk from "chalk";
import dotenv from 'dotenv'
import path from 'path'
import {pathExistsSync} from "path-exists";
import {program} from 'commander';
import exec from '@jt-cli/exec'
import log from "@jt-cli/log";
import pkg from '../package.json' with {type: 'json'};
import constant from './const.js';

const userHome = os.homedir();

export default core;

function core() {
  prepare();
  registerCommand();
}

function registerCommand() {
  program
      .name(Object.keys(pkg.bin)[0])
      .usage('<command> [options]')
      .version(pkg.version);

  program
      .command('init [projectName]')
      .option('-f, --force', '是否强制初始化项目')
      .action(exec);

  program.on("command:*", (obj) => {
    const availableCommands = program.commands.map(cmd => cmd.name());
    console.log(chalk.red('未知的命令：' + obj[0]));
    if (availableCommands.length) {
      console.log(chalk.red('可用命令：' + availableCommands.join(',')));
    }

  })

  program.parse(process.argv);
}

function prepare() {
  checkPkgVersion();
  checkRoot()
  checkUserHome()
  checkEnv()
}

function checkEnv() {
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({path: dotenvPath});
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

function checkRoot() {
  rootCheck()
}

function checkPkgVersion() {
  log.info("cli", pkg.version);
}

