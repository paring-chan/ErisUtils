import {ErisUtilClient} from '@chinobot/eris-utils'
import path from "path";

const bot = new ErisUtilClient(process.env.DISCORD_TOKEN as string, {
    listener: {
        dir: path.join(__dirname, 'listeners'),
        watch: true
    }
})

bot.listenerHandler!.setEmitters({
    client: bot.client
})

bot.client.on('ready', () => console.log(`Logged in as ${bot.client.user.username}$${bot.client.user.discriminator}`))

bot.on('log', msg => console.log(`[LOG] ${msg}`))

bot.client.connect()
