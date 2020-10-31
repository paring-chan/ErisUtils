import ErisUtilClient from "../ErisUtilClient";

export default class Listener {
    bot: ErisUtilClient
    event: string
    __path: string
    emitter: string

    constructor(client: ErisUtilClient, emitter: string, event: string) {
        this.bot = client
        this.event = event
        this.emitter = emitter
        this.__path = ''
    }

    execute(...args: any[]) {}
}