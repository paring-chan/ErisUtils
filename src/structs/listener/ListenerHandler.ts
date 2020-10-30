import {EventEmitter} from "events";
import Listener from "./Listener";
import ErisUtilClient from "../ErisUtilClient";

export default class ListenerHandler extends EventEmitter {
    listenerList: Listener[] = []

    constructor(client: ErisUtilClient) {
        super()
        client.emit = (event, ...args: any) => {
            this.listenerList.filter(value => {
                return value.event === event
            }).map(r=>r.execute(...args))
            return client.emit(event, ...args)
        }
    }

    load() {}

    unload() {}

    unregister() {}
}