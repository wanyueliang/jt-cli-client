import fs from 'fs';
import path from 'path';
import {  emptyDirSync } from 'fs-extra'
import inquirer from 'inquirer';
import Command from '@jt-cli/command'
import {loadTemplate} from "./loadTemplate.js";

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
class InitCommand extends Command {
  init(){
    this.projectName = this._argv[0] || ''
    this.force = !!this._cmd.force
  }
  async exec(){
    await this.prepare()
  }
  async prepare(){

    // 1. 判断当前目录是否为空
    const localPath = process.cwd();
    if (!this.isDirEmpty(localPath)) {
      let ifContinue = false;
      if (!this.force) {
        const { userContinue } = await inquirer.prompt({
          type: 'confirm',
          name: 'userContinue',
          default: false,
          message: '当前文件夹不为空，是否继续创建项目？',
        });
        ifContinue = userContinue;
        if (!ifContinue) return;
      }
      if(ifContinue || this.force) {
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认清空当前目录下的文件？',
        });
        if (confirmDelete) {
          // 清空当前目录
          emptyDirSync(localPath)
        }
      }
    }
    await this.getProjectInfo()
  }
  async  getProjectInfo(){
    function isValidName(v) {
      return /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }
    let projectInfo = {};
    let isProjectNameValid = false;
    if (isValidName(this.projectName)) {
      isProjectNameValid = true;
      projectInfo.projectName = this.projectName;
    }
    // 1. 选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: 'select',
      name: 'type',
      message: '请选择初始化类型',
      default: TYPE_PROJECT,
      choices: [{
        name: '项目',
        value: TYPE_PROJECT,
      }, {
        name: '组件',
        value: TYPE_COMPONENT,
      }],
    });
    const title = type === TYPE_PROJECT ? '项目' : '组件';
    const { framework } = await inquirer.prompt({
      type: 'select',
      choices:[
        { title: 'Vue', value: 'vue' },
        { title: 'React', value: 'react' },
        { title: 'Vanilla', value: 'vanilla' }
      ],
      name: 'framework',
      message: 'What is your framework?'
    })
    await  loadTemplate({projectName:'111',template:framework});
  }
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤的逻辑
    fileList = fileList.filter(file => (
        !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    ));
    return !fileList || fileList.length <= 0;
  }
}

function init(argv) {
  return new InitCommand(argv);
}
export { InitCommand,init }
