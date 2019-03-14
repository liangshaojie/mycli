const fs = require('fs-extra')
const path = require('path')
// 粉笔
const chalk = require('chalk')
// 与命令行交互用的东西
const inquirer = require('inquirer')
// 验证包名字的
const validateProjectName = require('validate-npm-package-name')

// const { getPromptModules } = require('./util/createTools')
const Creator = require('./Creator')


async function create(projectName, options) {
    const cwd = options.cwd || process.cwd()
    const targetDir = path.resolve(cwd, projectName)
    //验证报名
    const result = validateProjectName(projectName)
    if (!result.validForNewPackages) {
        console.error(chalk.red(`Invalid project name: "${name}"`))
        result.errors && result.errors.forEach(err => {
            console.error(chalk.red.dim('Error: ' + err))
        })
        result.warnings && result.warnings.forEach(warn => {
            console.error(chalk.red.dim('Warning: ' + warn))
        })
        exit(1)
    }
    //检查目录是否存在
    if (fs.existsSync(targetDir)) {

    }
    const creator = new Creator(projectName, targetDir,[])
    await creator.create(options)
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        // stopSpinner(false) // do not persist
        error(err)
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1)
        }
    })
}