import glob from 'glob';
import { join } from 'path';

import { readFile, writeFile, getCompiledScriptPath } from '../lib/fileSystem';
import appVersion from '../../common/js/lib/appVersion';

const helpers = glob.sync(join(__dirname, 'helpers/*.js')).reduce((content, path) => {
  const helperContent = readFile(path, { encoding: 'utf-8' });
  const cleanHelper = helperContent.replace(/export (default )?/g, '');
  return `${content}\n${cleanHelper}`;
}, '');

export default ({ id, content }) => {
  try {
    const convertedContent = (content || '').replace(/function (frame|start|leadInFrame|leadOutFrame|beat|input)/g, 'this.$1 = function $1');

    const safeAppVersion = appVersion.replace(/\./g, '_');
    const wrapperName = `Script__${id}__${safeAppVersion}`;
    const wrappedContent = `function ${wrapperName}(){\n${helpers}\n${convertedContent}\n}`;

    const scriptRequire = `require = require('module').createRequire('${join(__dirname, '../../../node_modules')}')`;

    const finalContent = `${scriptRequire}\nmodule.exports = ${wrappedContent}`;
    const finalPath = getCompiledScriptPath(id);

    writeFile(finalPath, finalContent);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
