import type * as boxenmod from 'boxen';
import * as deasync from 'deasync';
import boxenSettings from './boxenSettings';
export let boxenLib: typeof boxenmod;
// eslint-disable-next-line no-eval
eval(`import('boxen')`).then((b) => boxenLib = b);
deasync.loopWhile(()=>!boxenLib);

export const boxen = (text: string, options?: boxenmod.Options) => boxenLib.default(text, boxenSettings(options));
export default boxen;
