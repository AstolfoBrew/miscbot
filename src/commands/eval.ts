import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder,
} from 'discord.js';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (!process.env.OWNERS.split(',').includes(interaction.user.id))
      return await interaction.reply({
        'ephemeral': true,
        'embeds': [(new EmbedBuilder).setTitle('Warning')
          .setDescription('You do not have permission to execute this command.\nThis incident might have been reported.')]
      });
    return interaction.reply({
      'content': 'Click below to run code',
      'components': [new ActionRowBuilder({
        'components': [(new ButtonBuilder).setLabel('Evaluate Code')
          .setEmoji('🔒')
          .setCustomId('evalbtn')
          .setStyle(ButtonStyle.Danger)]
      }) as any]
    });
  };
  data = (new SlashCommandBuilder)
    .setName('eval')
    .setDescription('Developer-only command!')
    .setDefaultMemberPermissions('0')
    .setDMPermission(true);
};
