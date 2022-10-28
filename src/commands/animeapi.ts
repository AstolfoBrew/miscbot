import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,
} from 'discord.js';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ 'ephemeral': interaction.options.getBoolean('ephemeral') ?? true });
    await interaction.editReply('Currently unimplemented!');
  };
  data = (new SlashCommandBuilder)
    .setName('animeapi')
    .setDescription('Lets you get various images from various, primarily anime-themed apis')
    .addBooleanOption(v=>v.setName('ephemeral').setDescription('Should it show for just you, or should it use for others too? [default=true/only you]')
      .setRequired(false));
};
