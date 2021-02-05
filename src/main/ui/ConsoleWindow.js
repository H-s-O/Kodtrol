import EventEmitter from 'events';
import { join } from 'path';
import { BrowserWindow } from 'electron';
import { Colors } from '@blueprintjs/core';

import * as ConsoleWindowEvent from '../events/ConsoleWindowEvent';

export default class ConsoleWindow extends EventEmitter {
  win = null;
  contents = null;
  visible = false;

  constructor() {
    super();

    this.win = new BrowserWindow({
      title: 'Console',
      show: false,
      maximizable: false,
      minWidth: 400,
      minHeight: 400,
      backgroundColor: Colors.DARK_GRAY3,
      show: false,
      webPreferences: {
        nodeIntegration: true,
      }
    });
    this.win.removeMenu();
    this.win.on('close', this.onClose);
    this.win.once('closed', this.onClosed);
    this.win.once('ready-to-show', this.onReadyToShow);

    this.win.loadFile(join(__dirname, '..', '..', '..', 'build', 'ui', 'console.html'));

    this.contents = this.win.webContents;
    this.contents.once('did-finish-load', this.onFinishLoad);
  }

  onReadyToShow = () => {
    this._updateVisibility();
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

  setVisible = (flag) => {
    this.visible = flag;
    this._updateVisibility();
  }

  _updateVisibility = () => {
    if (this.win) {
      if (this.visible) {
        this.win.showInactive();
        this.win.moveTop();
      } else {
        this.win.hide();
      }
    }
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
