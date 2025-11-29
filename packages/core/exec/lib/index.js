import { init } from  '@jt-cli/init'
const SETTINGS = {
  init: '@jt-cli/init',
  publish: '@jt-cli/publish',
  add: '@jt-cli/add',
};
const CACHE_DIR = 'dependencies';
async function exec () {
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const args = Array.from(arguments);
  init(args)
}


export default exec;
