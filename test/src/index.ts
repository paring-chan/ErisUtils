import {ErisUtilClient} from '@chinobot/eris-utils'
import path from "path";

const bot = new ErisUtilClient(process.env.DISCORD_TOKEN as string, {}, {
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
    },
    i18n: {
        watch: true,
        dir: path.join(__dirname, 'locales'),
        getLang: () => 'ko-KR',
        fallback: 'ko-KR'
    }
})

process.on('uncaughtException', error => {
    console.error(error)
})

process.on('unhandledRejection', (reason) => {
    console.error(reason)
})

process.on('uncaughtExceptionMonitor', error => console.error(error))

bot.listenerHandler!.setEmitters({
    client: bot.client
})

bot.client.connect()
