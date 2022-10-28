import {
  APIEmbedField,
  EmbedBuilder, ModalSubmitInteraction
} from 'discord.js';
import client from '..';
import * as fs from 'fs-extra';
import path from 'path';

const splitInto = (str: string, len: number) => {
  const regex = new RegExp(`.{${  len  }}|.{1,${  Number(len - 1)  }}`, 'gu');
  return str.match(regex);
};
export const name = 'evalmodal';
export const execute = async (interaction: ModalSubmitInteraction) => {
  if (!process.env.OWNERS.split(',').includes(interaction.user.id))
    return await interaction.reply({
      'ephemeral': true,
      'embeds': [(new EmbedBuilder).setTitle('Warning')
        .setDescription('You do not have permission to use this feature.\nThis incident might have been reported.')]
    });
  const code = interaction.fields.getTextInputValue('evaltext');
  const split = splitInto(code, 750);
  const entries: APIEmbedField[] = split.map((v, idx) => ({
    'name': `- Inputted Code (${idx + 1} of ${split.length}) -`,
    'value': `\`\`\`js
${v}
\`\`\``,
  }));
  const embed = (new EmbedBuilder).setTitle('Evaluating...')
    .setDescription('Evaluating Code')
    .addFields(...entries)
    .setThumbnail(client.user.avatarURL())
    .setColor('#ef9df2');
  await interaction.reply({ 'embeds': [embed] });
  try {
    // eslint-disable-next-line no-eval
    const result = await eval(`async (fs, path, interaction, guild, author, client)=>{
      ${code}
    }`)(fs, path, interaction, interaction.guild, interaction.member, client);
    embed.addFields({
      'name': 'Result',
      'value': `Type: \`${typeof result}\`
Value: \`\`\`js
${`${typeof result === 'object' ? JSON.stringify(result) : result}`.split('`')
    .join('​`')}
\`\`\``
    });
  } catch (error) {
    embed.addFields({
      'name': 'Result',
      'value': `Type: Throwable - \`${typeof error}\`
Value: \`\`\`js
${`${typeof error === 'object' ? JSON.stringify(error) : error}`.split('`')
    .join('​`')}
\`\`\``
    });
  }
  await interaction.editReply({ 'embeds': [embed] });
};
