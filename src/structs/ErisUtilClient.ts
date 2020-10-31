import {Client} from "eris";
import ListenerHandler from "./listener/ListenerHandler";
import {EventEmitter} from "events";

declare interface ErisUtilClient {
    on(event: 'log', handler: (msg: string) => void): this
}

class ErisUtilClient extends EventEmitter {
    listenerHandler?: ListenerHandler
    client: Client

    constructor(token: string, {listener, initialEvents}: {
        listener?: {
            dir: string,
            watch: boolean
        }
        initialEvents?: any
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
        this.emit('log', 'Client initialized')
    }
}

export default ErisUtilClient
