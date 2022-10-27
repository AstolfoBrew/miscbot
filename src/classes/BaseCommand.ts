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


import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder, SlashCommandBuilder
} from 'discord.js';

/** Base Command Interface */
export interface IBaseCommand {
  /** Command Information, as passed to Discord */
  data: Partial<SlashCommandBuilder>;
  /** Execute Function */
  execute(interaction: ChatInputCommandInteraction<CacheType>): any
}

/** Base Command Class */
export abstract class BaseCommand implements IBaseCommand {
  data: Partial<SlashCommandBuilder>;
  execute(interaction: ChatInputCommandInteraction<CacheType>): any {
    interaction.reply({
      'embeds': [(new EmbedBuilder)
        .setTitle('Error')
        .setDescription('This command\'s execute function was not defined yet!')
        .setFields({
          'name': 'Possible Reasons',
          'value': `**Command may be WIP** This command may be a work-in-progress, and not completed yet!
**Old Command** This command may have been partially removed`
        })],
      'ephemeral': true
    });
  };
}
