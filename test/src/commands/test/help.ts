import {Command, ErisUtilClient, CommandContext} from '@chinobot/eris-utils'

export default class Help extends Command {
    constructor(client: ErisUtilClient) {
        super(client, {
            name: '도움말',
            aliases: ['help'],
            category: 'test'
        });
    }

    execute(ctx: CommandContext) {
        ctx.send('테스트')
    }
}