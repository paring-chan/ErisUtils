import {EventEmitter} from "events";
import Command from "./Command";
import ErisUtilClient from "../ErisUtilClient";
import chokidar from 'chokidar'
import path from "path";
import fs from 'fs/promises'
import {Message} from "eris";
import CommandContext from "./CommandContext";

class CommandHandler extends EventEmitter {
    commandMap: Map<string, Command> = new Map<string, Command>()
    private watcher?: chokidar.FSWatcher
    private readonly dir: string
    prefix: string|((msg:Message)=>(Promise<string>|string))
    client: ErisUtilClient

    constructor(client: ErisUtilClient, {
        watch,
        dir,
        prefix
    }: {
        watch: boolean
        dir: string
        prefix: string
    }) {
        super()

        this.prefix = prefix

        this.client = client

        this.client.client.on('messageCreate',async msg => {
            let prefix: string
            if (typeof this.prefix === 'string') prefix = this.prefix
            else {prefix = await this.prefix(msg)}
            if (!msg.content.startsWith(prefix)) return
            const args = msg.content.slice(prefix.length).split(/ +/g)
            const command = args.shift()!
            const cmd = Array.from(this.commandMap.values()).find(r=>r.options.name === command || r.options.aliases!.includes(command))
            if (!cmd) return this.emit('commandNotFound', msg)
            const ctx = new CommandContext(this.client, msg, Array.from(args), cmd)
            try {
                await cmd.execute(ctx)
            } catch (e) {
                this.emit('error', ctx, e)
            }
        })

        try {
            this.dir = path.resolve(dir)
        } catch (e) {
            throw new Error(`Path ${dir} not found.`)
        }

        this.loadAll().then(() => this.client.emit('log', 'Listeners load complete'))

        if (watch) {
            this.startWatch()
        }
    }

    load(path1: string) {
        let module = require(path1)
        if (module.default) {
            module = module.default
        }
        const command = new module(this.client)

        if (!command) throw new Error(`Command not found on path ${path1}`)

        command.__path = path1

        this.commandMap.set(command.__path, command)

        this.emit('load', command)

        this.client.emit('log', `Loaded command on path ${path1}`)
    }

    unload(path: string) {
        this.commandMap.delete(path)
        delete require.cache[require.resolve(path)]
    }

    reload(path: string) {
        this.client.emit('log', `Reloading command on path ${path}`)
        try {
            this.unload(path)
        } catch (e) {
            // for not loaded commands
        }
        this.load(path)
    }

    async loadAll(directory = this.dir) {
        const dir = await fs.readdir(directory)
        for (const value of dir) {
            if ((await fs.stat(path.join(directory, value))).isDirectory()) {
                await this.loadAll(path.join(directory, value))
            } else {
                try {
                    this.load(path.join(directory, value))
                } catch (e) {
                    this.client.emit('log', `Error while loading command with path ${value}: ${e.message}`)
                }
            }
        }
    }

    private startWatch() {
        this.watcher = chokidar.watch(this.dir)
        this.watcher.on('change', (path1) => {
            this.reload(path1)
        })
        this.client.emit('log', 'Commands watch started')
    }
}

export default CommandHandler
