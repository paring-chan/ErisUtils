import {Client} from "eris";
import ListenerHandler from "./listener/ListenerHandler";
import {EventEmitter} from "events";
import CommandHandler from "./command/CommandHandler";

declare interface ErisUtilClient {
    on(event: 'log', handler: (msg: string) => void): this
}

class ErisUtilClient extends EventEmitter {
    listenerHandler?: ListenerHandler
    commandHandler?: CommandHandler
    client: Client

    constructor(token: string, {listener, initialEvents, command}: {
        listener?: {
            dir: string
            watch: boolean
        }
        initialEvents?: any
        command?: {
            dir: string
            watch: boolean
            prefix: string
        }
    }) {
        super();

        if (initialEvents) {
            Object.entries(initialEvents).forEach(([key,val]) => {
                this.on(key as any, val as any)
            })
        }

        this.client = new Client(token)
        if (listener) {
            this.listenerHandler = new ListenerHandler(this, listener)
        }
        if (command) {
            this.commandHandler = new CommandHandler(this, command)
        }
        this.emit('log', 'Client initialized')
    }
}

export default ErisUtilClient
