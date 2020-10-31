import {Command, ErisUtilClient, CommandContext} from '@chinobot/eris-utils'

export default class Help extends Command {
    constructor(client: ErisUtilClient) {
        super(client, {
            name: '도움말',
            aliases: ['help'],
            category: 'test'
        });
    }

    async execute(ctx: CommandContext) {
        const t = (await ctx.bot.i18n!.getT('ko-KR'))!
        console.log(t('common:test'))
        await ctx.send('도움말')
    }
}