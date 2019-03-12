const fs = require('fs')
const path = require('path')

//命令行添加颜色用的东西
const chalk = require('chalk')
//命令工具
const program = require('commander')

//该包的版本号
program
    .version(require('./package').version)
    .usage('<command> [options]')

//未知命令
program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
        console.log()
    })

// 增加help 命令
program.on('--help', () => {
    console.log()
    console.log(`Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
    console.log()
})

//解析参数
program.parse(process.argv)

//如果没有输入参数,等价于 --help
if (!process.argv.slice(2).length) {
    program.outputHelp()
}


