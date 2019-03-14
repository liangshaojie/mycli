const path = require('path')
const chalk = require('chalk')
const debug = require('debug')
const execa = require('execa')
const inquirer = require('inquirer')
const semver = require('semver')
const EventEmitter = require('events')
const cloneDeep = require('lodash.clonedeep')
const writeFileTree = require('./util/writeFileTree')

// const getVersions = require('./util/getVersions')

// const { clearConsole } = require('./util/clearConsole')

module.exports = class Creator extends EventEmitter {
    constructor(name, context, promptModules) {
        super()
        this.name = name
        this.context = process.env.VUE_CLI_CONTEXT = context
    }
    async create(cliOptions = {}, preset = null) {
        if (!preset) {
            preset = await this.promptAndResolvePreset()
        }
        const { name, context } = this
        // 深拷贝一份数据
        preset = cloneDeep(preset)
        console.log( preset.plugins)
        preset.plugins['@vue/cli-service'] = Object.assign(
            {
                projectName: name
            }, preset, {
                bare: cliOptions.bare
            }
        )
        const pkg = {
            name,
            version: '0.1.0',
            private: true,
            devDependencies: {}
        }
        const deps = Object.keys(preset.plugins)
        deps.forEach(dep => {
            if (preset.plugins[dep]._isPreset) {
                return
            }
            pkg.devDependencies[dep] = (
                preset.plugins[dep].version || 'latest'
            )
        })
        console.log("开始写文件")
        // write package.json
        await writeFileTree(context, {
            'package.json': JSON.stringify(pkg, null, 2)
        })
        console.log('写完了。。。。。')
    }
    async promptAndResolvePreset(answers = null) {
        if (!answers) {
            const promptList = [{
                "name": "preset",
                "type": "list",
                "message": "Please pick a preset:",
                "choices": [
                    {
                        "name": "default (babel, eslint)",
                        "value": "default"
                    },
                    {
                        "name": "Manually select features",
                        "value": "__manual__"
                    }
                ]
            }];
            // await clearConsole(true)  清除控制台，后面实现，锦上添花
            // answers = await inquirer.prompt(promptList)
            let preset
            // if (answers.preset === 'default') {
                preset = {
                    "router": false,
                    "vuex": false,
                    "useConfigFiles": false,
                    "plugins": {
                        "@vue/cli-plugin-babel": {},
                        "@vue/cli-plugin-eslint": {
                            "config": "base",
                            "lintOn": [
                                "save"
                            ]
                        }
                    }
                }
            // }
            return preset
        }
    }

}