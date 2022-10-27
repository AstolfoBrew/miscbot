// expdani, if you use these changes, fyi, you legally need to credit me
// in fact, you still legally are requried to credit me for the changes in https://github.com/expdani/discordjs-template/commit/bf292b3bfdb8930dac7ce76fefb38f69ac644e93
// see https://github.com/expdani/discordjs-template/issues/1

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
  EmbedBuilder,
  Interaction,
} from 'discord.js';
import { BaseCommand } from '../classes/BaseCommand';
import { DiscordClient } from '../classes/discord';
import ButtonNotFoundException from '../exceptions/ButtonNotFoundException';
import CommandNotFoundException from '../exceptions/CommandNotFoundException';
import Exception from '../exceptions/Exception';
import ModalNotFoundException from '../exceptions/ModalNotFoundException';

/** Fire every time */
export const once = false;
/** This should handle all interactions */
export const execute = async (client: DiscordClient, interaction: Interaction) => {
  // TODO: Cleanup this code
  if (interaction.isChatInputCommand())
    try {
      const command: BaseCommand = client.commands.get(interaction.commandName);
      if (!command)
        throw new CommandNotFoundException(interaction.commandName);
      return await command.execute(interaction);
    } catch (err:any) {
      const ExceptionErr: Exception | null = err instanceof Exception ? err : null;
      console.error(err);
      const failedEmbed = (new EmbedBuilder).setTitle('An error ocurred while running this command')
        .setDescription(ExceptionErr ? `${ExceptionErr.name}: ${ExceptionErr.message}` : `Cannot provide details about this error. Ask the developer of this bot to check the console.`)
        .setColor('#ff0000');
      if (!interaction.replied && !interaction.deferred)
        await interaction.reply({ 'embeds': [failedEmbed] });
      else if (interaction.replied)
        await interaction.fetchReply().then(msg=>
          msg.edit({
            'embeds': [
              ...msg.embeds,
              failedEmbed
            ]
          })
        );
    }
  else if (interaction.isButton())
    try {
      const btn = client.buttons.get(interaction.customId);
      if (!btn)
        throw new ButtonNotFoundException(interaction.customId);
      return await btn.execute(interaction);
    } catch (err) {
      const ExceptionErr: Exception | null = err instanceof Exception ? err : null;
      console.error(err);
      const failedEmbed = (new EmbedBuilder).setTitle('An error ocurred while running this button')
        .setDescription(ExceptionErr ? `${ExceptionErr.name}: ${ExceptionErr.message}` : `Cannot provide details about this error. Ask the developer of this bot to check the console.`)
        .setColor('#ff0000');
      if (!interaction.replied && !interaction.deferred)
        interaction.reply({
          'embeds': [failedEmbed], 'ephemeral': true
        });
      else if (interaction.replied)
        interaction.fetchReply().then(msg=>
          msg.edit({
            'embeds': [
              ...msg.embeds,
              failedEmbed
            ]
          })
        );
    }
  else if (interaction.isModalSubmit())
    try {
      const btn = client.modals.get(interaction.customId);
      if (!btn)
        throw new ModalNotFoundException(interaction.customId);
      return await btn.execute(interaction);
    } catch (err) {
      const ExceptionErr: Exception | null = err instanceof Exception ? err : null;
      console.error(err);
      const failedEmbed = (new EmbedBuilder).setTitle('An error ocurred while running this modal')
        .setDescription(ExceptionErr ? `${ExceptionErr.name}: ${ExceptionErr.message}` : `Cannot provide details about this error. Ask the developer of this bot to check the console.`)
        .setColor('#ff0000');
      if (!interaction.replied && !interaction.deferred)
        interaction.reply({
          'embeds': [failedEmbed], 'ephemeral': true
        });
      else if (interaction.replied)
        interaction.fetchReply().then(msg=>
          msg.edit({
            'embeds': [
              ...msg.embeds,
              failedEmbed
            ]
          })
        );
    }
};
