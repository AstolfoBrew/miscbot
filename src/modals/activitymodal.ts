import {
  ActivityType, ModalSubmitInteraction
} from 'discord.js';
import { addActivity } from '../commands/setStatus';

export const name = 'activitymodal';
export const execute = async (interaction: ModalSubmitInteraction) => {
  const type = interaction.fields.getTextInputValue('type');
  if (!ActivityType[type])
    return await interaction.reply({
      'ephemeral': true,
      'content': 'bro u needa specify a valid type'
    });
  await addActivity({
    'name': interaction.fields.getTextInputValue('name'),
    'type': ActivityType[type],
    'url': interaction.fields.getTextInputValue('url')
  });
  await interaction.reply('ok');
  await interaction.deleteReply();
};
