import EventEmitter from 'events';
import { join } from 'path';
import { BrowserWindow } from 'electron';
import { Colors } from '@blueprintjs/core';

import * as MainWindowEvent from '../events/MainWindowEvent';

export default class MainWindow extends EventEmitter {
  win = null;
  contents = null;
  
  static __devToolsAdded = false;
  
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
        webSecurity: false, // Allows fetch() to use "file://" scheme
      }
    });
    this.win.on('close', this.onClose);
    this.win.once('closed', this.onClosed);
    this.win.once('ready-to-show', this.onReadyToShow);
    
    const isDev = true;
    if (isDev) {
      if (!MainWindow.__devToolsAdded) {
        BrowserWindow.addDevToolsExtension(join(__dirname, '../../../dev/extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.1_0'));
        BrowserWindow.addDevToolsExtension(join(__dirname, '../../../dev/extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0'));
        MainWindow.__devToolsAdded = true;
      }
    } 

    this.win.loadFile(join(__dirname, '../../../build/ui/index.html'));
    
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
    // disable page zoom/scale
    this.contents.setZoomFactor(1);
    this.contents.setVisualZoomLevelLimits(1, 1);
    this.contents.setLayoutZoomLevelLimits(0, 0);
    
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
