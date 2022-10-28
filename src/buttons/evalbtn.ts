import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';


export const name = 'evalbtn';
export const execute = async (interaction: ButtonInteraction) => {
  if (!process.env.OWNERS.split(',').includes(interaction.user.id))
    return await interaction.reply({
      'ephemeral': true,
      'embeds': [(new EmbedBuilder).setTitle('Warning')
        .setDescription('You do not have permission to use this feature.\nThis incident might have been reported.')]
    });
  await interaction.showModal((new ModalBuilder).setTitle('DEVELOPER 🔒 RUN REMOTE CODE')
    .addComponents(new ActionRowBuilder({
      'components': [(new TextInputBuilder).setLabel('eval')
        .setCustomId('evaltext')
        .setMaxLength(4000)
        .setRequired(true)
        .setPlaceholder('🔒 ONLY RUN TRUSTED CODE 🔒')
        .setStyle(TextInputStyle.Paragraph)]
    }))
    .setCustomId('evalmodal'));
  await interaction.message.delete();
};
