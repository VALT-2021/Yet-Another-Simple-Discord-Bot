import fs from 'fs'

export class SlashCommandHandler {
    public path: string
    public slash: Map<any, any>

    constructor(path: string) {
        this.path = path
    }

    public async init() {
        let folder = fs.readdirSync(this.path).filter(file => file.endsWith('js'))
        for (let file of folder) {
            let base = (await import(this.path + '/' + file))['default']
            this.slash.set(base.name, base)
        }
    }

    public execute(slashCommandName: string): Function {
        return this.slash.get(slashCommandName).execute()
    }
}

export class ComponentHandler {
    public path: string
    public component: Map<any, any>

    constructor(path: string) {
        this.path = path
    }

    public async init() {
        let folder = fs.readdirSync(this.path).filter(file => file.endsWith('js'))
        for (let file of folder) {
            let base = (await import(this.path + '/' + file))['default']
            this.component.set(base.type + base.id, base)
        }
    }

    public execute(componentIdentifier: string): Function {
        return this.component.get(componentIdentifier).execute()
    }
}