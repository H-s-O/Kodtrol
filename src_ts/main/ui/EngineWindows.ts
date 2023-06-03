import { MenuItemConstructorOptions } from 'electron'

import BaseWindow from './BaseWindow'

class EngineWindow extends BaseWindow {
  constructor() {
    super({
      id: 'enginewindow',
      defaultWidth: 640,
      defaultHeight: 480,
      showOnLoaded: false,
    })
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return []
  }
}

export default EngineWindow
