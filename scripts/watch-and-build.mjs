import * as esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import stylePlugin from 'esbuild-style-plugin';
import copyFilePlugin from 'esbuild-plugin-copy-file';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

const ctx = await esbuild.context({
  plugins: [
    stylePlugin(),
    copyFilePlugin({
      after: {
        [join(ROOT_DIR, 'build', 'ui', 'worker-javascript.js')]: join(ROOT_DIR, 'node_modules', 'ace-builds', 'src-noconflict', 'worker-javascript.js'),
      }
    })
  ],
  entryPoints: [
    // Common
    join(ROOT_DIR, 'src', 'ui', 'styles', 'common.css'),
    join(ROOT_DIR, 'src', 'ui', 'styles', 'root.less'),
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
  external: ['electron*'],
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
