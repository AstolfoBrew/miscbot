import {
  CacheType, ChatInputCommandInteraction, EmbedBuilder, EmbedField, SlashCommandBuilder,
} from 'discord.js';
import {
  BaseCommand, IBaseCommand
} from '../classes/BaseCommand';
import {
  Booru as BooruJS, Post
} from 'boorujs';
import Exception from '../exceptions/Exception';
import axios from 'axios';

const booruAuths: Record<string, string> = {};
const booruPostCache: Record<string, Post[]> = {};

const shuffleArray: <T>(array: T[]) => T[] = (array) => {
  for (let i = array.length - 1; i > 0; i--) {

    // Generate random number
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const getPosts = async (auth: string | undefined, tags: string, api: string, amount: number): Promise<{
  field?: EmbedField,
  image: {
    attachment: string,
    name: string
  }
}[]> => {
  const apitype = api.split('_').shift();
  const apiid = api;
  api = api.split('_').pop();
  switch (apitype) {
  case 'boorujs': {
    if (!booruPostCache[`${apiid}.${tags}`]) {
      const booru = new BooruJS(api as any, ...(auth ?? '').split(':').reverse());
      booruPostCache[`${apiid}.${tags}`] = await booru.Posts(tags, 10);
    }
    const posts = shuffleArray(booruPostCache[`${apiid}.${tags}`]);
    return posts.filter((_, idx) => idx < amount).map(post => ({
      'field': {
        'name': `${post.id}`,
        'value': `URL: ${post.URL}
Source: ${post.Source}
Filename: ${post.fileName}`,
        'inline': false
      },
      'image': {
        'attachment': post.URL,
        'name': post.fileName
      }
    }));
  }
  case 'nekosfun': {
    const categ = tags.split(' ').pop();
    const posts: ({
      attachment: string,
      name: string
    })[] = [];
    for (let i = 0; i < amount; i++) {
      const { data } = await axios(`http://api.nekos.fun:8080/api/${categ}`);
      const { image } = data;
      posts.push({
        'attachment': image,
        'name': image.split('/').pop()
      });
    }
    console.log(posts);
    return posts.filter((_, idx) => idx < amount).map(post => ({ 'image': post }));
  }

  default:
    throw new Exception(`unsupported api type: ${apitype}`);
  }
};

export class Command extends BaseCommand implements IBaseCommand {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (interaction.options.getString('apilogin'))
      booruAuths[interaction.user.id] = interaction.options.getString('apilogin');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
    // @ts-ignore
    const tags = `${(interaction.channel.nsfw ?? interaction.channel.parent.nsfw) && !ephemeral ? 'rating:safe ' : ''}${interaction.options.getString('tags')}`;
    await interaction.deferReply({ ephemeral });
    const deeta = await getPosts(booruAuths[interaction.user.id], tags, interaction.options.getString('api'), interaction.options.getNumber('quantity') ?? 1);
    const d = {
      'embeds': deeta.filter(v=>v.field).length > 0 ? [(new EmbedBuilder).setDescription('image sources/ids:')
        .addFields(...deeta.filter(v=>v.field).map(v=>v.field))
        .toJSON()] : undefined,
      'files': deeta.map(v=>v.image)
    };
    await interaction.editReply(d);
  };
  data = (new SlashCommandBuilder)
    .setName('animeapi')
    .setDescription('Lets you get various images from various, primarily anime-themed apis')
    .addSubcommand(subcmd=>subcmd.setName('booru').setDescription('Boorus, using boorujs')
      .addStringOption(v => v.setName('api').setDescription('Which API to use')
        .setRequired(true)
        .setChoices({
          'name': 'Gelbooru',
          'value': 'boorujs_gelbooru'
        }, {
          'name': 'Rule34.xxx',
          'value': 'booujs_rule34'
        }, {
          'name': 'Konachan',
          'value': 'boorujs_konachan'
        }, {
          'name': 'Safebooru',
          'value': 'boorujs_safebooru',
        }, {
          'name': 'The Big Image Board',
          'value': 'boorujs_tbib',
        }, {
          'name': 'Yande.re',
          'value': 'boorujs_yandere'
        }, {
          'name': 'Realbooru',
          'value': 'boorujs_realbooru'
        }, {
          'name': 'E621',
          'value': 'boorujs_e621'
        }))
      .addStringOption(v=>v.setName('tags').setDescription('Which tags to use? (works for most image boards)')
        .setRequired(false))
      .addNumberOption(v=>v.setName('quantity').setDescription('How many images?')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10))
      .addBooleanOption(v=>v.setName('ephemeral').setDescription('Should it show for just you, or should it use for others too? [default=true/only you]')
        .setRequired(false))
      .addStringOption(v => v.setName('apilogin').setDescription('API Login, in user:key format - Only for some APIs - Saves in memory for your specific userid')))
    .addSubcommand(subcmd => subcmd.setName('nekosfun').setDescription('Images from nekos.fun')
      .addStringOption(v => v.setName('api').setDescription('always nekos.fun for this subcommand')
        .setRequired(true)
        .setChoices({
          'name': 'nekos.fun',
          'value': 'nekosfun_nekosfun'
        }))
      .addStringOption(v => v.setName('tags').setDescription('Which category to use?')
        .setRequired(true)
        .setChoices(...[
          'Kiss', 'Lick', 'Hug', 'Baka', 'Cry', 'Poke', 'Smug', 'Slap', 'Tickle', 'Pat', 'Laugh', 'Feed', 'Cuddle', 'AnimalEars', 'Waifu',
        ].map(v=>({
          'name': v, 'value': v.toLowerCase()
        }))))
      .addNumberOption(v=>v.setName('quantity').setDescription('How many images?')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)))
    .addSubcommand(subcmd => subcmd.setName('nekosfun-nsfw').setDescription('Images from nekos.fun')
      .addStringOption(v => v.setName('api').setDescription('always nekos.fun for this subcommand')
        .setRequired(true)
        .setChoices({
          'name': 'nekos.fun',
          'value': 'nekosfun_nekosfun'
        }))
      .addStringOption(v => v.setName('tags').setDescription('Which category to use?')
        .setRequired(true)
        .setChoices(...[
          'Ass', 'Blowjob', 'Boobs', 'Cum', 'Feet', 'Hentai', 'Wallpapers', 'Spank', 'Gasm', 'Lesbian', 'Lewd', 'Pussy', 'Holo', // 'Bellevid'
        ].map(v=>({
          'name': v, 'value': v.toLowerCase()
        }))))
      .addNumberOption(v=>v.setName('quantity').setDescription('How many images?')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)));
};
