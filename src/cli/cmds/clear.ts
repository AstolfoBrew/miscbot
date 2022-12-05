import { ICmd } from '..';
import chalk from '../../chalk';
import miscbotAscii from '../../miscbotAscii';
import whoami from '../whoami';

export const cmd: ICmd = {
  'execute': () => {
    console.clear();
    console.log(`${chalk.rgb(122, 122, 255)(miscbotAscii)}
${whoami()}`);
  },
  'name': 'clear',
  'description': 'Clears the console'
};
