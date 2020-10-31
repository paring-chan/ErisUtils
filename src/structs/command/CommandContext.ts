import {Message, MessageFile} from "eris";
import Command from "./Command";
import ErisUtilClient from "../ErisUtilClient";

export default class CommandContext {
    message: Message
    command: Command
    bot: ErisUtilClient
    constructor(bot: ErisUtilClient, msg: Message, cmd: Command) {
        this.message = msg
        this.command = cmd
        this.bot = bot
    }

    send = (content: string, file?: MessageFile|MessageFile[]) => this.bot.client.createMessage(this.message.channel.id, content, file)
}