import icongen from 'icon-gen';
import { join, dirname } from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');

console.table({
  ROOT_DIR
});

try {
  await mkdir(join(ROOT_DIR, 'build', 'icons'), { recursive: true });

  await icongen(join(ROOT_DIR, 'src', 'icons', 'app.png'), join(ROOT_DIR, 'build', 'icons'), {
    report: true,
    favicon: null,
    ico: {
      name: 'app',
    },
    icns: {
      name: 'app',
    },
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
