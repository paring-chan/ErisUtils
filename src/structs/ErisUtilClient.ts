import {Client, ClientOptions, Message} from "eris";
import ListenerHandler from "./listener/ListenerHandler";
import {EventEmitter} from "events";
import CommandHandler from "./command/CommandHandler";
import I18NRegistry from "./i18n/I18NRegistry";

declare interface ErisUtilClient {
    on(event: 'log', handler: (msg: string) => void): this
}

class ErisUtilClient extends EventEmitter {
    listenerHandler?: ListenerHandler
    commandHandler?: CommandHandler
    i18n?: I18NRegistry
    client: Client

    constructor(token: string, clientOptions?: ClientOptions, {listener, initialEvents, command, i18n}: {
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
        i18n?: {
            dir: string
            watch: boolean
            getLang(msg: Message): string | Promise<string>
        }
    }={}) {
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
        if (i18n) {
            this.i18n = new I18NRegistry(this, i18n)
        }
        this.emit('log', 'Client initialized')
    }
}

export default ErisUtilClient
