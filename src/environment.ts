/*
MIT License

Copyright (c) 2022 Yielding
Certain portions of this software may be Copyright (c) 2022 expdani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import EnvException from './exceptions/EnvException';
import FileNotFoundException from './exceptions/FileNotFoundException';
import { StackToSingleLine } from './util/StackToSingleLine';
import boxenImported from './boxen';
import boxenSettings from './boxenSettings';

const envFile = `${path.resolve(__dirname, '..')}/.env`;

const requireds = [
  'DISCORD_API_KEY',
  'MONGODB_URI',
  'MONGODB_NAME',
  'OWNERS',
];

const envContent = () =>`
#     /$$         /$$               /$$                                 /$$   
#    /$$/        | $$              | $$                                |  $$  
#   /$$/        /$$$$$$    /$$$$$$ | $$   /$$  /$$$$$$  /$$$$$$$        \\  $$ 
#  /$$/        |_  $$_/   /$$__  $$| $$  /$$/ /$$__  $$| $$__  $$        \\  $$
# |  $$          | $$    | $$  \\ $$| $$$$$$/ | $$$$$$$$| $$  \\ $$         /$$/
#  \\  $$         | $$ /$$| $$  | $$| $$_  $$ | $$_____/| $$  | $$        /$$/ 
#   \\  $$        |  $$$$/|  $$$$$$/| $$ \\  $$|  $$$$$$$| $$  | $$       /$$/  
#    \\__/         \\___/   \\______/ |__/  \\__/ \\_______/|__/  |__/      |__/   

# Discord Bot Token:
DISCORD_API_KEY=${process.env.DISCORD_API_KEY ?? process.env.TOKEN ?? 'REPLACE ME'}


#     /$$                                                                   /$$ /$$             /$$   
#    /$$/                                                                  | $$| $$            |  $$  
#   /$$/        /$$$$$$/$$$$   /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$| $$$$$$$        \\  $$ 
#  /$$/        | $$_  $$_  $$ /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$__  $$| $$__  $$        \\  $$
# |  $$        | $$ \\ $$ \\ $$| $$  \\ $$| $$  \\ $$| $$  \\ $$| $$  \\ $$| $$  | $$| $$  \\ $$         /$$/
#  \\  $$       | $$ | $$ | $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$        /$$/ 
#   \\  $$      | $$ | $$ | $$|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$/|  $$$$$$$| $$$$$$$/       /$$/  
#    \\__/      |__/ |__/ |__/ \\______/ |__/  |__/ \\____  $$ \\______/  \\_______/|_______/       |__/   
#                                                 /$$  \\ $$                                           
#                                                |  $$$$$$/                                           
#                                                 \\______/                                            

# MongoDB Database URI:
MONGODB_URI=${process.env.MONGODB_URI ?? process.env.MONGODB ?? 'mongodb://127.0.0.1:27017/'}
# MongoDB Database Name:
MONGODB_NAME=miscbot


#     /$$                                      /$$$$$$        /$$   
#    /$$/                                     /$$__  $$      |  $$  
#   /$$/         /$$$$$$$  /$$$$$$  /$$$$$$$ | $$  \\__/       \\  $$ 
#  /$$/         /$$_____/ /$$__  $$| $$__  $$| $$$$            \\  $$
# |  $$        | $$      | $$  \\ $$| $$  \\ $$| $$_/             /$$/
#  \\  $$       | $$      | $$  | $$| $$  | $$| $$              /$$/ 
#   \\  $$      |  $$$$$$$|  $$$$$$/| $$  | $$| $$             /$$/  
#    \\__/       \\_______/ \\______/ |__/  |__/|__/            |__/   

# List of owner user-ids, seperated by commas
# For sensitive commands
OWNERS=${process.env.OWNERS ?? '898971210531078164,12343567890'}
`;
if (!fs.existsSync(envFile)){
  const fileNotFoundEx = new FileNotFoundException(envFile);
  fs.writeFileSync(envFile, envContent());
  const envException = new EnvException(`No .env file found!
We have created a template .env file for you - please input your API key & similar there.`, StackToSingleLine(fileNotFoundEx));
  StackToSingleLine(envException);
  console.error(envException);

  console.error(boxenImported('Please check & update the newly created .env file!', boxenSettings({ 'title': 'No .env file found!' })));

  process.exit(1);
}

const file = dotenv.config({ 'path': envFile });

const unmetRequirements = requireds.filter(v => !process.env[v]);

if (process.env.DISCORD_API_KEY === 'REPLACE ME') {
  const envException = new EnvException(`Please update your .env file.`, StackToSingleLine(new EnvException('Sample token found; Please replace it in your .env file.')));
  StackToSingleLine(envException);
  console.error(envException);

  console.error(boxenImported('Please check & update the .env file\'s discord token', boxenSettings({ 'title': 'Sample Token Found' })));

  process.exit(1);
}

if (unmetRequirements.length > 0) {
  const envLackingException = new EnvException('Did not meet all environment requirements. Your .env file has been reset, with all existing fields populated.');
  fs.writeFileSync(envFile, envContent());
  const envException = new EnvException(`Please update your .env file.`, StackToSingleLine(envLackingException));
  StackToSingleLine(envException);
  console.error(envException);

  console.error(boxenImported('Please check & update the updated .env file', boxenSettings({ 'title': 'Env file updated!' })));

  process.exit(1);
}

/**
 * Export constants from the dotenv file
 */
export const env = file && file.parsed || {};
