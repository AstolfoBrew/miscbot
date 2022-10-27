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
import { BaseCommand } from '../classes/BaseCommand';
import { DiscordClient } from '../classes/discord';

/**
 * Should only fire once!
 */
export const once = true;
/*
  This is an event that gets triggered on ready.
 */
export const execute = (client: DiscordClient) => {
  const {
    commands, application, buttons, modals
  } = client;

  const commandFiles = readdirSync('./src/commands').filter(
    (file: any) => file.endsWith('.ts') || file.endsWith('.js')
  );
  for (const file of commandFiles) {
    const commandInteraction: BaseCommand = new (require(`../commands/${file}`).Command);
    commands.set(commandInteraction.data.name, commandInteraction);
  }

  const commandData = commands.map((i) => i.data);

  const buttonFiles = readdirSync('./src/buttons').filter(
    (file: any) => file.endsWith('.ts') || file.endsWith('.js')
  );
  for (const file of buttonFiles) {
    const interaction = require(`../buttons/${file}`);
    buttons.set(interaction.name, interaction);
  }

  const modalFiels = readdirSync('./src/modals').filter(
    (file: any) => file.endsWith('.ts') || file.endsWith('.js')
  );
  for (const file of modalFiels) {
    const interaction = require(`../modals/${file}`);
    modals.set(interaction.name, interaction);
  }

  // @ts-ignore
  return application.commands?.set(commandData);
};
