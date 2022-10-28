import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,
} from 'discord.js';
import client from '..';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';
import * as fs from 'fs';

/*
  This is an example interaction command that echoes your message.
 */
export class Command extends BaseCommand implements IBaseCommand {
  execute(interaction: ChatInputCommandInteraction<CacheType>) {
    return interaction.reply({
      'embeds': [(new EmbedBuilder).setThumbnail(client.user.avatarURL())
        .setColor('#ef9df2')
        .addFields({
          'name': 'Developers',
          'value': `• Yielding#3961
• Mokiy#2876`,
          'inline': true
        },
        {
          'name': 'Testers',
          'value': `• aga#3014`,
          'inline': true
        }, { // u must have smth providing the license if u use this
          'name': 'License',
          'value': `• [MIT License](https://github.com/AstolfoBrew/miscbot/blob/master/LICENSE)
• [Source Code](https://github.com/AstolfoBrew/miscbot)`
        })
        .setFooter({ 'text': 'Made with ❤️, using code, by AstolfoDev', })
        .setTimestamp()]
    });
  };
  data = (new SlashCommandBuilder)
    .setName('credits')
    .setDescription('Sends credits & license info <3');
};
