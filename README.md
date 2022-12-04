## About

Miscbot is a simple multipurpose bot, designed as an open-source alternative to some of the most popular bots.

## Building from Source
### Requirements

- An editor with TypeScript support ([Visual Studio Code](https://code.visualstudio.com/)) is recommended.
- [PNPM](https://pnpm.io/)
- [Node](https://nodejs.org/en/download/) (v16.9 or higher)
- A [Discord Bot](https://discord.com/developers)
- A MongoDB Instance

### Getting started

1. `pnpm i`
2. `pnpm dev` -> ctrl+c once it errors
3. add the token to [`.env`](.env)
   > if you don't, the bot will error and ask you to add it.<br/>
   > btw the bot needs `applications.commands`
4. Put your MongoDB URL into `.env`
5. `pnpm dev`
