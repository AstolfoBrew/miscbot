import {
  ActionRowBuilder,
  ActivityOptions,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  CacheType, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, PresenceData, PresenceStatusData, SlashCommandBuilder, TextInputBuilder,
} from 'discord.js';
import client from '..';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';

export let presence: PresenceData;
export const addActivity = (activity: ActivityOptions) => {
  presence.activities.push(activity);
  return client.user.setPresence(presence);
};

export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (!process.env.OWNERS.split(',').includes(interaction.user.id))
      return await interaction.reply({
        'ephemeral': true,
        'embeds': [(new EmbedBuilder).setTitle('Warning')
          .setDescription('You do not have permission to execute this command.\nThis incident might have been reported.')]
      });
    presence = {
      'activities': [],
      'afk': interaction.options.getBoolean('afk'),
      'status': interaction.options.getString('status') as PresenceStatusData
    };
    client.user.setPresence(presence);
    return interaction.reply({
      'content': 'done!', 'components': [new ActionRowBuilder({
        'components': [(new ButtonBuilder).setCustomId('addactivity')
          .setLabel('Add Activity')
          .setEmoji('➕')
          .setStyle(ButtonStyle.Primary)],
      }) as any], 'ephemeral': true
    });
  };
  data = (new SlashCommandBuilder)
    .setName('status')
    .setDescription('Developer-only command! Sets the bot presence.')
    .setDefaultMemberPermissions('0')
    .setDMPermission(true)
    .addStringOption(op => op.setName('status').setDescription('Status Type')
      .setChoices({
        'name': 'Online',
        'value': 'online'
      }, {
        'name': 'Idle',
        'value': 'idle'
      }, {
        'name': 'Invisible/Offline',
        'value': 'invisible'
      }, {
        'name': 'DND (do not disturb)',
        'value': 'dnd'
      })
      .setRequired(false))
    .addBooleanOption(v=>v.setName('afk').setDescription('Is the user AFK')
      .setRequired(false));
};
