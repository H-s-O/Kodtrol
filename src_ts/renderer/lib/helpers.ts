import { WindowAdditionalArgs } from '../../common/types';

export const extractAdditionalData = () => {
  try {
    const prefix = '--kodtrol=';
    const arg = process.argv.find((val) => val.startsWith(prefix));
    if (!arg) return null;
    const str = arg.substring(prefix.length);
    const json = JSON.parse(str) as WindowAdditionalArgs;
    return json;
  } catch (err) {
    console.error('Error extracting additional data:', err);
    return null;
  }
};
