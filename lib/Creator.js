const path = require('path')
const chalk = require('chalk')
const debug = require('debug')
const execa = require('execa')
const inquirer = require('inquirer')
const semver = require('semver')
const EventEmitter = require('events')

// const { clearConsole } = require('./util/clearConsole')

module.exports = class Creator extends EventEmitter {
    constructor(name, context, promptModules) {
        super()
        this.name = name
        this.context = process.env.VUE_CLI_CONTEXT = context
    }
    async create(cliOptions = {}, preset = null) {
        debugger
        if (!preset) {
            preset = await this.promptAndResolvePreset()
        }
    }
    async promptAndResolvePreset(answers = null) {
        if (!answers) {
            const promptList = [    {
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
            answers = await inquirer.prompt(promptList)
            console.log(answers)
        }
    }

}