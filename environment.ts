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
import EnvException from './src/exceptions/EnvException';
import FileNotFoundException from './src/exceptions/FileNotFoundException';
import { StackToSingleLine } from './src/util/StackToSingleLine';

const envFile = `${path.resolve(__dirname)}/.env`;

if (!fs.existsSync(envFile)){
  const fileNotFoundEx = new FileNotFoundException(envFile);
  fs.writeFileSync(envFile, `# Your Discord Bot Token:
DISCORD_API_KEY=

# (Optional) List of owner user-ids, seperated by commas
OWNERS=898971210531078164,12343567890
`);
  const envException = new EnvException(`No .env file found!
We have created a template .env file for you - please input your API key & similar there.`, fileNotFoundEx);
  StackToSingleLine(envException);
  throw envException;
}

const file = dotenv.config({ 'path': envFile });

/**
 * Export constants from the dotenv file
 */
export const env = file && file.parsed || {};
