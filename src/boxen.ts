import type * as boxenmod from 'boxen';
import * as deasync from 'deasync';
export let boxenLib: typeof boxenmod;
// eslint-disable-next-line no-eval
eval(`import('boxen')`).then((b) => boxenLib = b);
deasync.loopWhile(()=>!boxenLib);

export const boxen = boxenLib.default;
export default boxen;
