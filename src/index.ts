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

try {
  process.title = '< miscbot >';
} catch (error) {}

import miscbotAscii from './miscbotAscii';

console.log(`${miscbotAscii}
Loading Dependencies....`);

import {
  Collection, DiscordAPIError, GatewayIntentBits
} from 'discord.js';
import { readdirSync } from 'fs';
import { env } from './environment';
import { DiscordClient } from './classes/discord';
import Exception from './exceptions/Exception';
import NotFoundException from './exceptions/NotFoundException';
import boxen from './boxen';

if (!env.DISCORD_API_KEY)
  throw new NotFoundException(`Missing API Key!
Please specify an API key in your .env file!`);

console.log('Loading @discordjs/voice...');
import '@discordjs/voice';

console.log('Preparing Client...');

const client = new DiscordClient({
  'intents': [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates
  ],
});

client.commands = new Collection;
client.buttons = new Collection;
client.modals = new Collection;

console.log('Loading Events...');

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

console.log('Handle SIGINT...');

process.on('SIGINT', () => {
  console.log('Exiting due to SIGINT');
  client.destroy();
  process.exit(0);
});

console.log('Logging In...');
client.login(env.DISCORD_API_KEY).catch((reason: any) => {
  console.error(new Exception('Discord API Connection Failed', reason instanceof Exception || reason instanceof DiscordAPIError ? reason : new Exception(reason)));
  boxen('Discord API Connection failed.\nMaybe your token is invalid?');
  process.exit(1);
});

export default client;
