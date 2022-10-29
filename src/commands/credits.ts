import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,
} from 'discord.js';
import path from 'path';
import client from '..';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

export class Command extends BaseCommand implements IBaseCommand {
  execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const attachLicense = interaction.options.getBoolean('attachlicense');
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
        .setTimestamp()],
      'files': attachLicense ? [{ 'attachment': path.resolve(__dirname, '..', '..', 'LICENSE.txt') }] : []
    });
  };
  data = (new SlashCommandBuilder)
    .setName('credits')
    .setDescription('Sends credits & license info <3')
    .addBooleanOption(v=>v.setName('attachlicense').setDescription('Should we attach a license file?')
      .setRequired(false));
};
