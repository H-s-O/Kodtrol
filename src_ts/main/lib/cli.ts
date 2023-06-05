import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
  screenshots: { type: 'string' },
  project: { type: 'string' },
}).parseSync();

export const cliScreenshotsFile =
  (typeof argv.screenshots === 'string' && argv.screenshots.length > 0)
    ? argv.screenshots
    : undefined;

export const cliProjectFile =
  (typeof argv.project === 'string' && argv.project.length > 0)
    ? argv.project
    : undefined;
