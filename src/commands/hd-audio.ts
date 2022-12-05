import {
  AudioPlayerStatus,
  createAudioPlayer, createAudioResource, joinVoiceChannel
} from '@discordjs/voice';
import {
  CacheType, ChannelType, ChatInputCommandInteraction, SlashCommandBuilder,
} from 'discord.js';
import path from 'path';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

const voiceChannelTypes = [
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice
];
export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const channel = interaction.options.getChannel('channel');
    if (!voiceChannelTypes.includes(channel.type))
      return interaction.reply('specify a voice channel');
    const connection = joinVoiceChannel({
      'adapterCreator': interaction.channel.guild.voiceAdapterCreator,
      'guildId': interaction.channel.guild.id,
      'channelId': channel.id
    });
    const player = createAudioPlayer();
    connection.subscribe(player);
    await interaction.deferReply();
    player.on('error', error => {
      // @ts-ignore
      console.error('Error:', error.message, 'with track', error.resource?.metadata?.title);
    });
    await interaction.editReply({ 'content': 'prepare for HD audio', });
    player.play(createAudioResource(path.join(process.cwd(), 'resources', 'pipe.mp3')));
    player.on('stateChange', (_, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        connection.disconnect();
        interaction.deleteReply();
      }
    });
  };
  data = (new SlashCommandBuilder)
    .setName('hd-audio')
    .setDescription('An HD Audio Service for your server!')
    .addChannelOption(v=>v.setName('channel').setDescription('channel to connect to')
      .setRequired(true));
};
