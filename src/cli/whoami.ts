import client from '..';
import chalk from '../chalk';

export default ()=>`${chalk.greenBright('[miscli]')} ${chalk.blueBright('Bot')} ${chalk.grey('›')} ${chalk.blueBright(client.user.tag)} ${chalk.grey('›')} ${chalk.blueBright(client.user.id)}`;
