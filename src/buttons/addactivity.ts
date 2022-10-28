import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';


export const name = 'addactivity';
export const execute = async (interaction: ButtonInteraction) => {
  if (!process.env.OWNERS.split(',').includes(interaction.user.id))
    return await interaction.reply({
      'ephemeral': true,
      'embeds': [(new EmbedBuilder).setTitle('Warning')
        .setDescription('You do not have permission to use this feature.\nThis incident might have been reported.')]
    });
  await interaction.showModal((new ModalBuilder).setTitle('Add ➕ Activity')
    .addComponents(new ActionRowBuilder({
      'components': [(new TextInputBuilder).setLabel('Activity Type')
        .setCustomId('type')
        .setMaxLength(16)
        .setRequired(true)
        .setPlaceholder('Competing | Listening | Playing | Streaming | Watching')
        .setStyle(TextInputStyle.Short)]
    }), new ActionRowBuilder({
      'components': [(new TextInputBuilder).setLabel('Activity Name')
        .setCustomId('name')
        .setMaxLength(128)
        .setRequired(true)
        .setPlaceholder('Your Mother')
        .setStyle(TextInputStyle.Short)]
    }), new ActionRowBuilder({
      'components': [(new TextInputBuilder).setLabel('Activity URL')
        .setCustomId('url')
        .setMaxLength(128)
        .setRequired(false)
        .setPlaceholder('for streaming')
        .setStyle(TextInputStyle.Short)]
    }))
    .setCustomId('activitymodal'));
};
