import {Client} from "eris";
import ListenerHandler from "./listener/ListenerHandler";
import {EventEmitter} from "events";

declare interface ErisUtilClient {
    on(event: 'log', handler: (msg: string) => void): this
}

class ErisUtilClient extends EventEmitter {
    listenerHandler?: ListenerHandler
    client: Client

    constructor(token: string, {listener}: {
        listener?: {
            dir: string,
            watch: boolean
        }
    }) {
        super();
        this.client = new Client(token)
        if (listener) {
            this.listenerHandler = new ListenerHandler(this, listener)
        }
    }
}

export default ErisUtilClient
