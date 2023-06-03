import { join } from 'path'
import { MenuItemConstructorOptions } from 'electron'

import BaseWindow from './BaseWindow'
import { APP_NAME } from '../../common/constants'
import { IS_DEV } from '../constants'

class SplashWindow extends BaseWindow {
  constructor() {
    super({
      id: 'splashwindow',
      fixedWidth: 450,
      fixedHeight: 450,
      showOnLoaded: true,
      options: {
        title: APP_NAME,
        maximizable: false,
        resizable: false,
      },
    })
    this.setMenuBarVisibility(false)
    this.loadFile(join(__dirname, '..', '..', '..', 'build_ts', 'splash.html'))
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [
      { role: 'windowMenu' },
      ...(IS_DEV ? SplashWindow._getWindowDevMenu() : []) as MenuItemConstructorOptions[]
    ]
  }
}

export default SplashWindow
