import {Listener, ErisUtilClient} from '@chinobot/eris-utils'

export default class Ready extends Listener {
    constructor(client: ErisUtilClient) {
        super(client, 'client', 'ready');
    }

    execute() {
        console.log('Ready!')
    }
}