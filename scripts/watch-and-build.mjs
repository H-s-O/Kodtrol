import * as esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

const ctx = await esbuild.context({
  entryPoints: [
    // Common
    // join(ROOT_DIR, 'node_modules', 'css-electron-reset', 'index.css'),
    // join(ROOT_DIR, 'node_modules', '@blueprintjs', 'icons', 'lib', 'css', 'blueprint-icons.css'),
    // join(ROOT_DIR, 'node_modules', '@blueprintjs', 'datetime', 'lib', 'css', 'blueprint-datetime.css'),
    // join(ROOT_DIR, 'node_modules', '@blueprintjs', 'core', 'lib', 'css', 'blueprint.css'),
    join(ROOT_DIR, 'src', 'ui', 'styles', 'common.css'),
    // Audio sub-process
    join(ROOT_DIR, 'src', 'audio', 'index.html'),
    join(ROOT_DIR, 'src', 'audio', 'index.js'),
    // Console window
    join(ROOT_DIR, 'src', 'ui', 'console.html'),
    join(ROOT_DIR, 'src', 'ui', 'console.js'),
    // Editor window
    join(ROOT_DIR, 'src', 'ui', 'index.html'),
    join(ROOT_DIR, 'src', 'ui', 'index.js'),
    // Splash window
    join(ROOT_DIR, 'src', 'ui', 'splash.html'),
    join(ROOT_DIR, 'src', 'ui', 'splash.js'),
  ],
  loader: {
    '.js': 'jsx',
    '.html': 'copy',
    '.woff': 'copy',
    '.ttf': 'copy',
    '.eot': 'copy',
  },
  bundle: true,
  platform: 'node',
  target: 'chrome80',
  outdir: join(ROOT_DIR, 'build'),
});

await ctx.watch();
