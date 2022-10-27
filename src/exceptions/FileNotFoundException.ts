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

import SanitizePath from '../util/CensorPath';
import { StackToSingleLine } from '../util/StackToSingleLine';
import Exception from './Exception';
import * as fs from 'fs';

/**
 * @name FileNotFoundException
 * @description Triggered by a file not being found.
 * @exception @class
 */
export default class FileNotFoundException extends Exception {
  /**
   * Descrbies a EOENT (Entity not found exception)
   * @param file Path of the file
   * @param furtherInfomation Further information to provide the user
   * @param provideStackTrace Should we show a stack trace?
   */
  constructor(file: string, furtherInfomation?: string, provideStackTrace?: boolean) {
    file = SanitizePath(file);
    furtherInfomation = furtherInfomation ? SanitizePath(furtherInfomation) : furtherInfomation;
    super(`The file ${file} was not found.${furtherInfomation ? `
Further Information:
${furtherInfomation}` : ''}`);
    this.name = 'FileNotFoundException';
    if (!provideStackTrace){
      StackToSingleLine(this);
      const stack = this.stack.split('\n');
      stack.pop();
      this.stack = stack.join('\n');
    }
  }
  /**
   * Checks for {@link path}, and if missing, throws a {@link FileNotFoundException}
   * @param path Path of the required file
   * @alias {@link DemandFile}
   */
  DemandFile(path:string): void {
    return DemandFile(path);
  }
}

/**
 * Checks for {@link path}, and if missing, throws a {@link FileNotFoundException}
 * @param path Path of the required file
 */
export const DemandFile = (path: string) => {
  if (!fs.existsSync(path))
    throw new FileNotFoundException(path);
};
