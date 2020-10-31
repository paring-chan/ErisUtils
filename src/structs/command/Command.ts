import ErisUtilClient from "../ErisUtilClient";
import CommandContext from "./CommandContext";

type CommandOpts = {
    name: string
    aliases?: string[]
    permissions?: {
        user?: string[]
        client?: string[]
    }
    category?: string
}

export default class Command {
    bot: ErisUtilClient
    options: CommandOpts
    __path: string

    constructor(client: ErisUtilClient, options: CommandOpts) {
        this.bot = client
        this.__path = ''
        this.options = options
        this.options.aliases = this.options.aliases || []
    }

    execute(ctx: CommandContext) {}
}