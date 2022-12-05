import * as readline from 'readline/promises';
import client from '..';
import { chalkLib as chalkLib } from '../chalk';
const { 'default': chalk } = chalkLib;
export type ICmd = {
  execute: (args: string[]) => (Promise<any> | any),
  name?: string,
  description: string
}
export const cmdCache: Record<string, ICmd> = {};
export const start = async () => {
  const rl = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await rl.question(`${chalk.green('[miscli]')} ${client.user.username} ${chalk.grey('›')} `);
    const args = response.trim().split(' ');
    const cmd = args.shift().toLowerCase();
    try {
      if (!cmdCache[cmd])
        cmdCache[cmd] = require(`${__dirname}/cmds/${cmd}`)?.cmd;
    } catch (error) { }
    if (cmd)
      if (!cmdCache[cmd])
        console.error(`${chalk.red('[miscli]')} Unknown Command '${cmd}'`);
      else
        try {
          cmdCache[cmd].execute(args);
        } catch (error) {
          console.error(`${chalk.red('[miscli]')} Error while running command '${cmd}':\n`, error);
        }
  }
};
