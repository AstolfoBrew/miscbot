/*
MIT License

Copyright (c) 2022 Yielding
Certain portions of this software may be Copyright (c) 2022 expdani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { readdirSync } from 'fs';
import {
  Collection, DiscordAPIError, GatewayIntentBits
} from 'discord.js';
import { env } from '../environment';
import { DiscordClient } from './classes/discord';
import Exception from './exceptions/Exception';
import NotFoundException from './exceptions/NotFoundException';

if (!env.DISCORD_API_KEY)
  throw new NotFoundException(`Missing API Key!
Please specify an API key in your .env file!`);

const client = new DiscordClient({ 'intents': [GatewayIntentBits.Guilds], });

client.commands = new Collection;
client.buttons = new Collection;
client.modals = new Collection;

const eventFiles = readdirSync('./src/events').filter(
  (file: any) => file.endsWith('.ts') || file.endsWith('.js')
);

for (const file of eventFiles) {
  const eventName = file.split('.')[0];
  const event = require(`./events/${file}`);

  if (event.once)
    client.once(eventName, (...args) => event.execute(client, ...args));
  else
    client.on(eventName, (...args) => event.execute(client, ...args));
}

process.on('SIGINT', () => {
  console.log('Exiting due to SIGINT');
  client.destroy();
  process.exit(0);
});

client.login(env.DISCORD_API_KEY).catch((reason:any)=>{
  throw new Exception('Discord API Connection Failed', reason instanceof Exception || reason instanceof DiscordAPIError ? reason : new Exception(reason));
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

export default client;
