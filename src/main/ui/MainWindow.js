import EventEmitter from 'events';
import { join } from 'path';
import { BrowserWindow } from 'electron';
import { Colors } from '@blueprintjs/core';

import * as MainWindowEvent from '../events/MainWindowEvent';

export default class MainWindow extends EventEmitter {
  win = null;
  contents = null;

  constructor(title) {
    super();

    this.win = new BrowserWindow({
      title,
      width: 1600,
      height: 900,
      backgroundColor: Colors.DARK_GRAY3,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false, // Allows fetch() to use "file" scheme
      }
    });
    this.win.on('close', this.onClose);
    this.win.once('closed', this.onClosed);
    this.win.once('ready-to-show', this.onReadyToShow);

    this.win.loadFile(join(__dirname, '../../../build/ui2/index.html'));

    this.contents = this.win.webContents;
    this.contents.once('did-finish-load', this.onFinishLoad);
  }

  get browserWindow() {
    return this.win;
  }

  onReadyToShow = () => {
    this.win.show();
  }

  onFinishLoad = () => {
    this.emit(MainWindowEvent.LOADED);
  }

  onClose = (e) => {
    // Do not let the window close by itself; handle it in Main
    e.preventDefault();

    this.emit(MainWindowEvent.CLOSING);
  }

  onClosed = () => {
    this.emit(MainWindowEvent.CLOSED);
  }

  send = (channel, ...data) => {
    if (this.contents) {
      this.contents.send(channel, ...data);
    }
  }

  capture = async (selector, callback) => {
    if (this.contents) {
      const js = `
        (function() {
          try {
            let b = document.querySelector('${selector}').getBoundingClientRect();
            return {
              x: b.x,
              y: b.y,
              width: b.width,
              height: b.height
            };
          } catch (e) {
            return e.message;
          }
        })()`;
      const bounds = await this.contents.executeJavaScript(js);
      if (typeof bounds === 'string') {
        callback(bounds);
        return;
      }
      // We need to rounds values, otherwise get a runtime error:
      // "Error processing argument at index 0, conversion failure from #<Object>"
      const roundedBounds = {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      };
      this.contents.capturePage(roundedBounds, (image) => {
        callback(null, image);
      })
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
