import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  MenuItemConstructorOptions,
} from 'electron';
import windowStateKeeper from 'electron-window-state';

import { IS_DEV, IS_MAC, IS_LINUX, IS_WINDOWS, APP_VERSION } from '../constants';
import { WindowAdditionalArgs } from '../../common/types';

type BaseWindowConstructorParams = {
  id: string
  defaultWidth?: number
  defaultHeight?: number
  fixedWidth?: number
  fixedHeight?: number
  showOnLoaded?: boolean
  options?: BrowserWindowConstructorOptions
};

abstract class BaseWindow {
  public readonly window: BrowserWindow;

  private _windowState: windowStateKeeper.State;

  constructor({
    id,
    defaultWidth,
    defaultHeight,
    fixedWidth,
    fixedHeight,
    showOnLoaded = true,
    options = undefined
  }: BaseWindowConstructorParams) {
    this._windowState = windowStateKeeper({
      defaultWidth: defaultWidth ?? fixedWidth,
      defaultHeight: defaultHeight ?? fixedHeight,
      file: `kodtrol-${id}-state2.json`,
    });

    this.window = new BrowserWindow({
      x: this._windowState.x,
      y: this._windowState.y,
      width: fixedWidth ?? this._windowState.width,
      height: fixedHeight ?? this._windowState.height,
      show: false,
      ...options,
    });
    if (!IS_MAC) {
      this.window.setMenu(Menu.buildFromTemplate(this._generateMenu()));
    }

    this._windowState.manage(this.window);

    if (showOnLoaded) this.window.once('ready-to-show', this._onReady.bind(this));
    if (IS_MAC) this.window.on('focus', this._onFocus.bind(this));
  }

  public destroy(): void {
    this.window.destroy();
  }

  private _onReady(): void {
    this.window.show();
  }

  private _onFocus(): void {
    Menu.setApplicationMenu(Menu.buildFromTemplate(this._generateMenu()));
  }

  protected abstract _generateMenu(): MenuItemConstructorOptions[]
}

export default BaseWindow

export const createDevMenu = () => {
  return [
    {
      label: 'Dev',
      submenu: [
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'forceReload' },
      ]
    }
  ] as MenuItemConstructorOptions[];
};

export const createAdditionalArgs = (otherArgs?: { [x: string]: any }) => {
  return [
    `--kodtrol=${JSON.stringify({
      APP_VERSION,
      IS_DEV,
      IS_MAC,
      IS_WINDOWS,
      IS_LINUX,
      ...otherArgs,
    } as WindowAdditionalArgs)}`
  ];
};
