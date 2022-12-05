import type * as chalkmod from 'chalk';
import * as deasync from 'deasync';
export let chalkLib: typeof chalkmod;
// eslint-disable-next-line no-eval
eval(`import('chalk')`).then((b) => chalkLib = b);
deasync.loopWhile(()=>!chalkLib);

export const chalk = chalkLib.default;
export default chalk;
