import {Listener, ErisUtilClient} from '@chinobot/eris-utils'

export default class Ready extends Listener {
    constructor(client: ErisUtilClient) {
        super(client, 'client', 'ready');
    }

    execute() {
        console.log(`Logged in as ${this.bot.client.user.username}#${this.bot.client.user.discriminator}`)
    }
}