import log from 'electron-log';

import isDev from './isDev';
import { APP_NAME } from '../constants/app';

export default (fileName, catchErrors = !isDev) => {
  log.transports.file.fileName = `${APP_NAME}-${fileName}.log`;
  if (catchErrors) {
    log.catchErrors();
  }

  // Monkey-patch logging
  console.log = log.log;
};

