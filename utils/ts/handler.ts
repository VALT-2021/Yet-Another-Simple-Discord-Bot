import fs from 'fs'

export default class Handler {
    public commands: Map<any, any> = new Map()
    public components: Map<any, any> = new Map()
    public commandsFolder: string
    public componentsFolder: string
    public lang: string


    constructor(commandsFolder: string, componentsFolder: string, lang?: string) {
        this.commandsFolder = commandsFolder
        this.componentsFolder = componentsFolder
        this.lang = lang || 'js'
    }

    async init() {
        let commands = fs.readdirSync(this.commandsFolder).filter(base => base.endsWith(this.lang))
        for (let base of commands) {
            let file = await import('.' + this.commandsFolder + '/' + base)
            this.commands.set(file.default.name, file.default)
        }

        let components = fs.readdirSync(this.componentsFolder).filter(base => base.endsWith(this.lang))
        for (let base of components) {
            let file = await import('.' + this.componentsFolder + '/' + base)
            this.components.set(file.default.type + file.default.id, file.default)
        }

        console.log(`Loaded ${this.commands.size} and ${this.components.size}`)
    }
}