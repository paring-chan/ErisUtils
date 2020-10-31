import {Listener, ErisUtilClient} from '@chinobot/eris-utils'

export default class Error extends Listener {
    constructor(client: ErisUtilClient) {
        super(client, 'client', 'error');
    }

    execute() {
        console.log('error')
    }
}
