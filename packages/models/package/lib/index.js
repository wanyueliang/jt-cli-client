// file: Package.js
import path from 'path';
import fse from 'fs-extra';
import {pathExistsSync} from 'path-exists';
import {isObject, findPackageRoot, formatPath} from '@jt-cli/utils';
import {getDefaultRegistry, getNpmLatestVersion} from '@jt-cli/get-npm-info';
import {exec} from 'node:child_process';

function execAsync(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, {cwd}, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({stdout, stderr});
    });
  });
}

export class Package {
  constructor(options) {
    if (!options) throw new Error('Package类的options参数不能为空！');
    if (!isObject(options)) throw new Error('Package类的options参数必须为对象！');

    this.targetPath = options.targetPath; // 安装目录
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
  }

  async prepare() {
    if (!(pathExistsSync(this.targetPath))) {
      await fse.mkdirp(this.targetPath);
    }

    // if (this.packageVersion === 'latest') {
    //   this.packageVersion = await getNpmLatestVersion(this.packageName);
    // }
  }

  async exists() {
    await this.prepare();
    return pathExistsSync(path.resolve(this.targetPath, 'node_modules', this.packageName));
  }

  async install() {
    await this.prepare();

    const pkg = `${this.packageName}@${this.packageVersion}`;
    const registry = getDefaultRegistry();
    const cmd = `pnpm add ${pkg} --registry=${registry}`;

    await execAsync(cmd, this.targetPath);
  }

  async update() {
    await this.prepare();

    const latestVersion = await getNpmLatestVersion(this.packageName);
    if (this.packageVersion !== latestVersion) {
      const pkg = `${this.packageName}@${latestVersion}`;
      const registry = getDefaultRegistry();
      const cmd = `pnpm add ${pkg} --registry=${registry}`;
      await execAsync(cmd, this.targetPath);

      this.packageVersion = latestVersion;
    }
  }

  getRootFilePath() {
    const dir = findPackageRoot(this.targetPath);
    if (!dir) return null;

    const pkgFile = fse.readJsonSync(path.resolve(dir, 'package.json'));
    if (pkgFile && pkgFile.main) {
      return formatPath(path.resolve(dir, pkgFile.main));
    }
    return null;
  }
}
