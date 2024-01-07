import * as esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import stylePlugin from 'esbuild-style-plugin';
import copyFilesPlugin from 'esbuild-copy-files-plugin';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const IS_BUILD = process.argv.includes('--build');
const IS_MAIN = process.argv.includes('--main');
const IS_RENDERER = process.argv.includes('--renderer');

if (!IS_MAIN && !IS_RENDERER) {
  throw new Error('Must specify either --main or --renderer');
}

console.table({
  ROOT_DIR, IS_BUILD, IS_MAIN, IS_RENDERER
});

let config;
if (IS_RENDERER) {
  config = {
    plugins: [
      stylePlugin({
        renderOptions: {
          lessOptions: {
            math: 'always',
          },
        },
      }),
      copyFilesPlugin({
        source: join(ROOT_DIR, 'node_modules', 'ace-builds', 'src-noconflict', 'worker-javascript.js'),
        target: join(ROOT_DIR, 'build', 'ui', 'worker-javascript.js'),
      }),
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
    sourcemap: true,
    sourcesContent: !IS_BUILD,
    platform: 'node',
    target: 'chrome80',
    outdir: join(ROOT_DIR, 'build'),
    logLevel: 'info',
  };
} else if (IS_MAIN) {
  config = {
    plugins: [
      copyFilesPlugin({
        source: join(ROOT_DIR, 'src', 'main', 'lib', 'helpers'),
        target: join(ROOT_DIR, 'build', 'main', 'helpers'),
      }),
    ],
    entryPoints: [
      join(ROOT_DIR, 'src', 'main', 'kodtrol-main.js'),
    ],
    external: ['electron*'],
    bundle: true,
    sourcemap: true,
    sourcesContent: !IS_BUILD,
    platform: 'node',
    target: 'node12.13.0', // @TODO get automatically
    outdir: join(ROOT_DIR, 'build', 'main'),
    logLevel: 'info',
  };
}

if (IS_BUILD) {
  await esbuild.build(config);
} else {
  const ctx = await esbuild.context(config);
  await ctx.watch();
}
