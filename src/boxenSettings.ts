import type { Options } from 'boxen';

export const boxenSettings: (options?: Options) => Options = (options = {})=>({
  'padding': 1,
  'borderStyle': 'round',
  ...options,
});
export default boxenSettings;
