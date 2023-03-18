import EventEmitter from 'events';
import { join } from 'path';
import { BrowserWindow } from 'electron';
import { Colors } from '@blueprintjs/core';

// import * as EngineWindowEvent from '../events/EngineWindowEvent';

export default class EngineWindow extends EventEmitter {
  win = null;
  contents = null;

  constructor(messagePort) {
    super();

    this.win = new BrowserWindow({
      // show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false, // Allows fetch() to use "file" scheme
        contextIsolation: false,
        enableRemoteModule: true,
      }
    });
    this.win.on('close', this.onClose);
    this.win.once('closed', this.onClosed);
    // this.win.once('ready-to-show', this.onReadyToShow);

    // temp
    this.win.once('ready-to-show', () => this.win.webContents.postMessage('port', null, [messagePort]));

    this.win.loadFile(join(__dirname, '..', '..', '..', 'build', '_renderer', 'engine.html'));

    this.contents = this.win.webContents;
    this.contents.once('did-finish-load', this.onFinishLoad);
  }

  get browserWindow() {
    return this.win;
  }

  // onReadyToShow = () => {
  //   this.win.show();
  // }

  onFinishLoad = () => {
    this.emit('loaded');
  }

  onClose = (e) => {
    // Do not let the window close by itself; handle it in Main
    e.preventDefault();

    // this.emit(EngineWindowEvent.CLOSING);
  }

  onClosed = () => {
    // this.emit(EngineWindowEvent.CLOSED);
  }

  // send = (channel, ...data) => {
  //   if (this.contents) {
  //     this.contents.send(channel, ...data);
  //   }
  // }

  send = (data) => {
    if (this.win.webContents) {
      this.win.webContents.postMessage('message', data)
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
