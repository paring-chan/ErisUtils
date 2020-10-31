import ErisUtilClient from "../ErisUtilClient";
import path from 'path'
import {Message} from "eris";
import fs from "fs/promises";
import chokidar from "chokidar";

type optionsTyp = {
    dir: string
    getLang(msg: Message): string | Promise<string>
    watch: boolean
}

export default class I18NRegistry {
    dir: string
    modules: any[]
    bot: ErisUtilClient
    getLang: (msg: Message) => string | Promise<string>
    watcher?: chokidar.FSWatcher

    constructor(client: ErisUtilClient, {dir, getLang, watch}: optionsTyp) {
        this.dir = dir
        this.modules = []
        this.bot = client
        this.getLang = getLang

        this.loadAll(dir).then(() => this.bot.emit(`Loaded locales to I18N Registry.`))

        if (watch) {
        }
    }

    async loadAll(directory: string) {
        const dir = await fs.readdir(directory)
        for (const value of dir) {
            if ((await fs.stat(path.join(directory, value))).isDirectory()) {
                await this.loadAll(path.join(directory, value))
            } else {
                this.load(path.join(directory, value))
            }
        }
    }

    load(path1: string) {
        try {
            delete require.cache[require.resolve(path1)]
            const module = require(path1)
            if (this.modules.find(r => r.__path === path1)) return true
            module.__path = path
            module.lang = path1.replace(this.dir, '').split('/')[1]
            const fullPath = path1.split('.')[path1.split('.').length - 2].split('/')
            module.ns = fullPath[fullPath.length - 1]
            this.modules.push(module)
        } catch (e) {
            this.bot.emit('log', `Error on loading locale on path ${path1}: ${e.stack}`)
        }
    }

    async getT(lang?: string, msg?: Message): Promise<((key: string, templates?: any) => string) | undefined> {
        if (!lang && msg) lang = await this.getLang(msg)
        const mods = this.modules.filter(r => r.lang === lang)
        if (!mods.length) return undefined
        return (key, templates) => {
            const ns = key.split(':')
            const full = ns.pop()!.split('.')

            let current = mods.find(r => r.ns === ns[0]) as any

            full.forEach(p => {
                current = current[p]
                if (!current) return key
            })

            for (const template of templates) {
                current = current.split(`{{${template}}}`).join(templates[template])
            }
            return current
        }
    }

    unload(path: string) {
        this.modules = this.modules.filter(r=>r.__path!==path)
        delete require.cache[require.resolve(path)]
    }

    reload(path: string) {
        this.bot.emit('log', `Reloading command on path ${path}`)
        this.unload(path)
        this.load(path)
    }

    startWatching() {
        this.watcher = chokidar.watch(this.dir)
        this.watcher.on('change', (path1) => {
            this.reload(path1)
        })
        this.bot.emit('log', 'Locale watch started')
    }
}