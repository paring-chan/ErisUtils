import {Command, ErisUtilClient, CommandContext} from '@chinobot/eris-utils'
import {Embed} from "eris";

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

        await ctx.send({
            embed: {
                title: t('commands:help.title'),
                color: 0x4287f5
            }
        })
    }
}