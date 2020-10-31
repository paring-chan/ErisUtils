import {ErisUtilClient} from '@chinobot/eris-utils'
import path from "path";

const bot = new ErisUtilClient(process.env.DISCORD_TOKEN as string, {
    listener: {
        dir: path.join(__dirname, 'listeners'),
        watch: true
    },
    initialEvents: {
        log: (msg: string) => console.log(`[LOG] ${msg}`)
    },
    command: {
        dir: path.join(__dirname, 'commands'),
        watch: true,
        prefix: '.'
    }
})

bot.listenerHandler!.setEmitters({
    client: bot.client
})

bot.client.connect()
