import { BrowserWindow, BrowserWindowConstructorOptions, Menu, MenuItemConstructorOptions } from 'electron'
import windowStateKeeper from 'electron-window-state'

import { IS_MAC } from '../constants'

type BaseWindowConstructorParams = {
  id: string
  defaultWidth?: number
  defaultHeight?: number
  fixedWidth?: number
  fixedHeight?: number
  showOnLoaded?: boolean
  options?: BrowserWindowConstructorOptions
}
abstract class BaseWindow extends BrowserWindow {
  private _windowState?: windowStateKeeper.State

  constructor({
    id,
    defaultWidth,
    defaultHeight,
    fixedWidth,
    fixedHeight,
    showOnLoaded = true,
    options = undefined
  }: BaseWindowConstructorParams) {
    const windowState = windowStateKeeper({
      defaultWidth: defaultWidth ?? fixedWidth,
      defaultHeight: defaultHeight ?? fixedHeight,
      file: `kodtrol-${id}-state2.json`,
    })

    super({
      x: windowState.x,
      y: windowState.y,
      width: fixedWidth ?? windowState.width,
      height: fixedHeight ?? windowState.height,
      show: false,
      ...options,
    })
    if (!IS_MAC) {
      this.setMenu(Menu.buildFromTemplate(this._generateMenu()))
    }

    windowState.manage(this)

    this._windowState = windowState

    if (showOnLoaded) this.once('ready-to-show', this._onReady.bind(this))
    this.once('closed', this._onClosed.bind(this))
    if (IS_MAC) this.on('focus', this._onFocus.bind(this))
  }

  private _onReady(): void {
    this.show()
  }

  private _onFocus(): void {
    Menu.setApplicationMenu(Menu.buildFromTemplate(this._generateMenu()))
  }

  private _onClosed(): void {
    this._windowState = undefined
  }

  protected abstract _generateMenu(): MenuItemConstructorOptions[]

  protected static _getWindowDevMenu(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Dev',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { type: 'separator' },
          { role: 'toggleDevTools' },
        ]
      }
    ]
  }
}

export default BaseWindow
