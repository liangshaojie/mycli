const fs = require('fs')
const path = require('path')

//命令行添加颜色用的东西
const chalk = require('chalk')
//命令工具
const program = require('commander')

const minimist = require('minimist')


function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    })
    return args
}

//该包的版本号
program
    .version(require('./package').version)
    .usage('<command> [options]')

program
    .command('create <app-name>')
    .description('create a new project powered by vue-cli-service')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .option('-d, --default', 'Skip prompts and use default preset')
    .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset')
    .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-g, --git [message]', 'Force git initialization with initial commit message')
    .option('-n, --no-git', 'Skip git initialization')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .option('-c, --clone', 'Use git clone when fetching remote preset')
    .option('-x, --proxy', 'Use specified proxy when creating project')
    .option('-b, --bare', 'Scaffold project without beginner instructions')
    .action((name, cmd) => {
        const options = cleanArgs(cmd)
        //如果提供多个参数会被忽略
        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
        }
        // --git makes commander to default git to true
        if (process.argv.includes('-g') || process.argv.includes('--git')) {
            options.forceGit = true
        }
        require('./lib/create')(name, options)
    })

// info 命令
program
    .command('info')
    .description('print debugging information about your environment')
    .action((cmd) => {
        console.log(chalk.bold('\nEnvironment Info:'))
        //这里用的第三方库
        require('envinfo').run(
            {
                System: ['OS', 'CPU'],
                Binaries: ['Node', 'Yarn', 'npm'],
                Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
                npmPackages: '/**/{typescript,*vue*,@vue/*/}',
                npmGlobalPackages: ['@vue/cli']
            },
            {
                showNotFound: true,
                duplicates: true,
                fullTree: true
            }
        ).then(console.log)
    })

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


