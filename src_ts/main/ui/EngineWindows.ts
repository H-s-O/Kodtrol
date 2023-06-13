import { MenuItemConstructorOptions, MessagePortMain } from 'electron/main';

import BaseWindow from './BaseWindow';

class EngineWindow extends BaseWindow {
  constructor(messagePort: MessagePortMain) {
    super({
      id: 'enginewindow',
      messagePort,
      defaultWidth: 640,
      defaultHeight: 480,
      showOnLoaded: false,
      options: {
        webPreferences: {
        },
      },
    });
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [];
  }
}

export default EngineWindow;
