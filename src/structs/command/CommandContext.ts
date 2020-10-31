import {Message, MessageContent, MessageFile} from "eris";
import Command from "./Command";
import ErisUtilClient from "../ErisUtilClient";

export default class CommandContext {
    message: Message
    command: Command
    args: string[]
    bot: ErisUtilClient
    constructor(bot: ErisUtilClient, msg: Message, args: string[], cmd: Command) {
        this.message = msg
        this.command = cmd
        this.bot = bot
        this.args = args
    }

    send(content: MessageContent, file?: MessageFile|MessageFile[]) { return this.bot.client.createMessage(this.message.channel.id, content, file) }
}