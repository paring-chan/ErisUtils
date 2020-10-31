import {EventEmitter} from "events";
import Listener from "./Listener";
import ErisUtilClient from "../ErisUtilClient";
import chokidar from 'chokidar'
import path from "path";
import {readdirSync, statSync} from "fs";

declare interface ListenerHandler {
}

class ListenerHandler extends EventEmitter {
    listenerMap: Map<string, Listener> = new Map<string, Listener>()
    private watcher?: chokidar.FSWatcher
    private readonly dir: string
    client: ErisUtilClient
    emitters: Map<string, EventEmitter> = new Map()

    isEventEmitter(value: any) {
        return value
            && typeof value.on === 'function'
            && typeof value.emit === 'function';
    }

    setEmitters(emitters: any) {
        for (const [key, value] of Object.entries(emitters)) {
            if (!this.isEventEmitter(value)) throw new Error(`${key} is not an event emitter`);

            //@ts-ignore
            this.emitters.set(key, value);
        }

        return this;
    }

    addToEmitter(path: string) {
        const listener = this.listenerMap.get(path)
        if (!listener) throw new Error(`Listener with path ${path} not found.`)
        const emitter = this.isEventEmitter(listener.emitter) ? listener.emitter : this.emitters.get(listener.emitter)
        if (!this.isEventEmitter(emitter)) throw new Error(`Emitter ${listener.emitter} is not emitter`);
        (emitter as EventEmitter).on(listener.event, listener.execute);
        return listener;
    }

    constructor(client: ErisUtilClient, {
        watch,
        dir
    }: {
        watch: boolean
        dir: string
    }) {
        super()

        this.client = client

        this.emitters.set('client', client)

        this.emitters.set('utilClient', client)

        try {
            this.dir = path.resolve(dir)
        } catch (e) {
            throw new Error(`Path ${dir} not found.`)
        }

        this.loadAll()

        if (watch) {
            this.startWatch()
        }
    }

    load(path1: string) {
        let module = require(path1)
        if (module.default) {
            module = module.default
        }
        const listener = new (module)(this)

        if (!listener) throw new Error(`Listener not found on path ${path1}`)

        listener.__path = path1

        this.listenerMap.set(listener.__path, listener)

        this.addToEmitter(listener.__path)

        this.emit('load', listener)
    }

    unload() {
    }

    unregister() {
    }

    reload() {
    }

    loadAll(path=this.dir) {
        const dir = readdirSync(path)
        dir.forEach(value => {
            if (statSync(value).isDirectory()) {
                this.loadAll(value)
            } else {
                try {
                    this.load(value)
                } catch (e) {}
            }
        })
    }

    private startWatch() {
        this.watcher = chokidar.watch(this.dir)
        this.watcher.on('change', (path1) => {
        })
        this.client.emit('log', 'Watch started')
    }
}

export default ListenerHandler
