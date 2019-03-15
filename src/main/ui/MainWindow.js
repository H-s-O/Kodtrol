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
    this.emit(MainWindowEvent.CLOSING, e);
  }
  
  onClosed = () => {
    this.emit(MainWindowEvent.CLOSED);
  }
  
  close = () => {
    this.win.close();
  }
  
  destroy = () => {
    this.win.removeAllListeners();
    
    this.win = null;
    this.contents = null;
  }
}