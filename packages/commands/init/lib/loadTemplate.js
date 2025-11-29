import ora from 'ora'
import {copy, readJson, writeJson, remove} from 'fs-extra'
import chalk from "chalk";
import {join} from 'node:path'


const generatePackageJson = async (projectName) => {
  const projectPath = `${process.cwd()}/${projectName}`
  const originalPkg = await readJson(`${projectPath}/package.json`)
  await writeJson(
      `${projectPath}/package.json`,
      {
        ...originalPkg,
        name: projectName,
        version: '0.1.0'
      },
      {
        spaces: 4
      }
  )
}

const loadLocalTemplate = async options => {
  const {projectName, template} = options
  const spinner = ora({
    text: 'Copy template loading...',
    color: 'green'
  }).start()
  const templatePath = join(__dirname, `../../../templates/template-${template}`)
  await copy(templatePath, `${process.cwd()}/${projectName}`)
  spinner.text = 'Copy template success'
  // await generatePackageJson(projectName)
  spinner.spinner = 'moon'
  spinner.text = chalk.green(`Project named ${pc.bold(projectName)} created successfully!`)

  spinner.succeed()
  await remove(`${process.cwd()}/.temp`)
}
export const loadTemplate = async (options) => {
  await loadLocalTemplate(options)
}
