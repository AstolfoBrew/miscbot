import { readdirSync } from 'fs';
import path from 'path';
import {
  cmdCache, ICmd
} from '..';
import boxenLib from '../../boxen';
import boxenSettings from '../../boxenSettings';
import chalk from '../../chalk';

export const cmd: ICmd = {
  'execute': () => {
    readdirSync(__dirname).forEach(v => {
      const cmdNameSplit = v.split('\\').join('/')
        .split('/')
        .pop()
        .split('.');
      cmdNameSplit.pop();
      const cmdName = cmdNameSplit.join('.');
      try {
        if (!cmdCache[cmdName])
          cmdCache[cmdName] = require(path.join(__dirname, v)).cmd;
      } catch (error) {}
    });
    let longestName = 0;
    for (const dataIdx in cmdCache)
      longestName = Math.max(longestName, (cmdCache[dataIdx].name ?? dataIdx).length + 1);
    const nameBasedCmdCache: typeof cmdCache = {};
    for (const idx in cmdCache)
      if (Object.prototype.hasOwnProperty.call(cmdCache, idx)) {
        const val = cmdCache[idx];
        nameBasedCmdCache[val.name ?? idx] = val;
      }

    let cmdHelp = '';
    for (const name in nameBasedCmdCache)
      if (Object.prototype.hasOwnProperty.call(nameBasedCmdCache, name)) {
        const command = nameBasedCmdCache[name];
        const displayName = command.name ?? name;
        cmdHelp += `${chalk.blueBright(displayName)}${' '.repeat(Math.max(1, longestName - displayName.length))}${chalk.grey('›')} ${command.description}\n`;
      }
    console.log(boxenLib(cmdHelp.trim(), boxenSettings({
      'padding': {
        'left': 1,
        'right': 1,
        'top': 0,
        'bottom': 0
      }
    })));
  },
  'name': 'help',
  'description': 'Provides a list of commands'
};
