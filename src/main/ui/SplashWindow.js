import EventEmitter from 'events';
import { join } from 'path';
import { BrowserWindow } from 'electron';

import * as ConsoleWindowEvent from '../events/ConsoleWindowEvent';
import { APP_NAME } from '../../common/js/constants/app';
import { WINDOW_BACKGROUND } from '../../common/js/constants/ui';
console.log('__________', WINDOW_BACKGROUND)
export default class SplashWindow extends EventEmitter {
  win = null;
  contents = null;

  constructor() {
    super();

    this.win = new BrowserWindow({
      title: APP_NAME,
      show: false,
      width: 600,
      height: 400,
      // maximizable: false,
      // resizable: false,
      backgroundColor: WINDOW_BACKGROUND,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    // this.win.removeMenu();
    // this.win.on('close', this.onClose);
    // this.win.once('closed', this.onClosed);
    this.win.once('ready-to-show', this.onReadyToShow);

    this.win.loadFile(join(__dirname, '..', 'ui', 'splash.html'));

    this.contents = this.win.webContents;
    this.contents.once('did-finish-load', this.onFinishLoad);
  }

  get browserWindow() {
    return this.win;
  }

  onReadyToShow = () => {
    this.win.show();
    // this.win.webContents.openDevTools();
  }

  onFinishLoad = () => {
    this.emit(ConsoleWindowEvent.LOADED);
  }

  onClose = (e) => {
    // Do not let the window close by itself; handle it in Main
    e.preventDefault();

    this.emit(ConsoleWindowEvent.CLOSING);
  }

  onClosed = () => {
    this.emit(ConsoleWindowEvent.CLOSED);
  }

  send = (channel, ...data) => {
    if (this.contents) {
      this.contents.send(channel, ...data);
    }
  }

  destroy = () => {
    if (this.win) {
      this.win.removeAllListeners();
      this.win.destroy();
    }
    if (this.contents) {
      this.contents.removeAllListeners();
    }

    this.win = null;
    this.contents = null;
  }
}
