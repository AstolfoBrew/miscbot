import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,
} from 'discord.js';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const reason = interaction.options.getString('reason') ?? 'No Reason Specified', user = interaction.options.getUser('user');

    await interaction.reply({
      'embeds': [(new EmbedBuilder).setTitle('Unbanning...')
        .setDescription(`Unbanning <@${user.id}>...`)
        .setColor('#99aaff')]
    });

    await interaction.guild.members.unban(user, reason);

    let didDM: boolean;
    try {
      await user.send({
        'embeds': [(new EmbedBuilder).setTitle('You\'ve been banned!')
          .setDescription(`You've been unbanned from \`${interaction.guild.name}\``)
          .addFields({
            'name': 'Reason',
            'value': `>>> ${reason}`
          })
          .setColor('#ff99aa')
          .setTimestamp()]
      });
      didDM = true;
    } catch (error) {
      didDM = false;
    }

    return await interaction.editReply({
      'embeds': [(new EmbedBuilder).setTitle('Unbanned!')
        .setDescription(`The user <@${user.id}> has been unbanned successfully`)
        .addFields(...didDM ? [] : [{
          'name': 'Couldn\'t DM',
          'value': 'They likely have their DMs closed'
        }])
        .setColor('#99ffaa')
        .setTimestamp()]
    });
  };
  data = (new SlashCommandBuilder)
    .setName('ban')
    .setDescription('Bans the user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Member to bean')
        .setRequired(true)
    )
    .addStringOption(reason=>reason.setName('reason').setDescription('reason to put in audit log & try to dm')
      .setRequired(false));
};
