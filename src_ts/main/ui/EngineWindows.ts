import { MenuItemConstructorOptions, MessagePortMain } from 'electron/main';
import { join } from 'path';

import BaseWindow, { createAdditionalArgs, createDevMenu } from './BaseWindow';
import { IS_DEV } from '../constants';
import { cliEngineDevTools } from '../lib/cli';
import { APP_NAME } from '../../common/constants';

class EngineWindow extends BaseWindow {
  constructor(messagePort: MessagePortMain) {
    super({
      id: 'enginewindow',
      messagePort,
      defaultWidth: 800,
      defaultHeight: 800,
      showOnLoaded: cliEngineDevTools,
      options: {
        title: `${APP_NAME} - Engine`,
        webPreferences: {
          preload: join(__dirname, '..', '..', '..', 'build', 'engine', 'kodtrol-engine-preload.js'),
          sandbox: false,
          nodeIntegration: true,
          additionalArguments: createAdditionalArgs({
            HERSHEY_FONTS_DIR: join(__dirname, '..', '..', 'renderer', 'engine', 'hershey_fonts'),
          }),
        },
      },
    });
    if (cliEngineDevTools) {
      this.window.webContents.openDevTools();
    }
    this.window.loadFile(join(__dirname, '..', '..', '..', 'build', 'engine', 'kodtrol-engine.html'));
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [
      ...(IS_DEV ? createDevMenu() : []) as MenuItemConstructorOptions[]
    ];
  }
}

export default EngineWindow;
