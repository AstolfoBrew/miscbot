import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,
} from 'discord.js';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

/*
  This is an example interaction command that echoes your message.
 */
export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const reason = interaction.options.getString('reason') ?? 'No Reason Specified', user = interaction.options.getUser('user');

    await interaction.reply({
      'embeds': [(new EmbedBuilder).setTitle('Beaning...')
        .setDescription(`Banning <@${user.id}>...`)
        .setColor('#99aaff')]
    });
    let didDM;
    try {
      await user.send({
        'embeds': [(new EmbedBuilder).setTitle('You\'ve been banned!')
          .setDescription(`You've been banned from \`${interaction.guild.name}\``)
          .addFields({
            'name': 'Reason',
            'value': `>>> ${reason}`
          })
          .setColor('#ff99aa')
          .setFooter({ 'text': 'jk get fake beaned' })
          .setTimestamp()]
      });
      didDM = true;
    } catch (error) {
      didDM = false;
    }
    await new Promise(resolve=>setTimeout(resolve, 700));

    return await interaction.editReply({
      'embeds': [(new EmbedBuilder).setTitle('Banned!')
        .setDescription(`The user <@${user.id}> has been banned successfully`)
        .addFields(...didDM ? [] : [{
          'name': 'Couldn\'t DM',
          'value': 'They likely have their DMs closed'
        }])
        .setFooter({ 'text': 'jk get fake beaned' })
        .setColor('#99ffaa')
        .setTimestamp()]
    });
  };
  data = (new SlashCommandBuilder)
    .setName('bean')
    .setDescription('Fake Bans the user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Member to bean')
        .setRequired(true)
    )
    .addStringOption(reason=>reason.setName('reason').setDescription('reason to try to dm')
      .setRequired(false));
};
