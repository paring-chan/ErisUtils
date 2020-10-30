import ErisUtilClient from "../ErisUtilClient";

export default class Listener {
    client: ErisUtilClient
    event: string
    __path: string

    constructor(client: ErisUtilClient, event: string) {
        this.client = client
        this.event = event
        this.__path = __filename
    }

    execute(...args: any[]) {}
}