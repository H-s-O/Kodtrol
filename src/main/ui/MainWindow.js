import EventEmitter from 'events';
import path from 'path';
import { BrowserWindow } from 'electron';

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
      backgroundColor: '#333',
      show: false,
      webPreferences: {
        webSecurity: false, // Allows fetch() to use "file://" scheme
      }
    });
    this.win.on('close', this.onClose);
    this.win.once('closed', this.onClosed);
    this.win.once('ready-to-show', this.onReadyToShow);
    
    const isDev = true;
    if (isDev) {
      if (!MainWindow.__devToolsAdded) {
        BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../../dev/extensions/fmkadmapgofadopljbjfkapdkoienihi/3.4.0_0'));
        BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../../dev/extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0'));
        MainWindow.__devToolsAdded = true;
      }
      this.win.loadURL('http://localhost:8080/ui/index.html');
    } else {
      // @TODO load built page
    }
    
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

  capture = async (id, callback) => {
    if (this.contents) {
      const js = `
        (function() {
          let b = document.querySelector('*[data-screenshot-id="${id}"]').getBoundingClientRect();
          return {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height
          };
        })()`;
      const bounds = await this.contents.executeJavaScript(js);
      // We need to rounds values, otherwise get a runtime error:
      // "Error processing argument at index 0, conversion failure from #<Object>"
      const roundedBounds = {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      };
      this.contents.capturePage(roundedBounds, callback)
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