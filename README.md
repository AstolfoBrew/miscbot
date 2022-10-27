## About

It's a simple TypeScript written Discord.JS v14 bot - you can easily add commands. It automaticly updates the slash commands with the Discord API.

## How to use

### Creating a command

To create a new command, you can simply create a new TypeScript file in the `commands` folder. You can use whatever name you like. See `echo.ts` as an example.

### Creating an event

To create a new event, see the [Discord.JS Client documentation](https://discord.js.org/#/docs/main/stable/class/Client) for available events and create a new TypeScript file in the `events` folder with event name. For example: `createInteraction.ts` or `ready.ts`.

## Requirements

- An editor with TypeScript support ([Visual Studio Code](https://code.visualstudio.com/)) is recommended.
- [PNPM](https://pnpm.io/)
- [Node](https://nodejs.org/en/download/) (v16.9 or higher)

## Getting started

1. `pnpm i`
2.
3. add the token to [`.env`](.env)
   > if you don't, the bot will error and ask you to add it.<br/>
   > btw the bot needs `applications.commands`
4. `pnpm dev`

## Resources

###### General

- [Discord.JS Guide](https://discordjs.guide/)
- [Discord.JS Documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome)

###### Commands

- [Command Interaction](https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction)

## Comparison to expdani's repo (upstream)

- Has [exception classes](src/exceptions/) (less minimalistic; more boilerplate)
- Proper use of types & classes (upstream is filled with `: any` and implied `any`-s)
- Checks for errors in commands, and reports them to the end-user
- Better checks related to if something is a command interaction or not
