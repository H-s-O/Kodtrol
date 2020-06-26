import { BrowserWindow } from 'electron';
import { join } from 'path';

import AbstractOutput from './AbstractOutput';

export default class AudioOutput extends AbstractOutput {
  _audioWindow = null;
  _ready = false;

  constructor(device) {
    super();

    // @TODO handle different audio output devices
    // this._audioSubProcess = new AudioSubProcess();
    this._createAudioWindow();
    console.log('Audio output', device);

    this._setStatusConnected();
  }

  // temp
  flush() {

  }

  send(data) {
    // console.log(data)
    // if (this._audioSubProcess) {
    //   this._audioSubProcess.send(data);
    //   this._setSent();
    // }

    if (this._audioWindow && !this._audioWindow.isDestroyed() && this._ready) {
      this._audioWindow.webContents.send('data', data);
    }
  }

  _refreshStatus() {
    if (this._sent) {
      // Reset flag
      this._resetSent();
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
  }

  _createAudioWindow() {
    this._audioWindow = new BrowserWindow({
      show: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    });

    this._audioWindow.loadFile(join(__dirname, '../../../build/audio/index.html'));
    this._audioWindow.webContents.once('did-finish-load', this._onFinishLoad.bind(this));
  }

  _onFinishLoad() {
    this._ready = true;
  }

  _destroyAudioWindow() {
    if (this._audioWindow) {
      this._audioWindow.removeAllListeners();
      this._audioWindow.close();
    }
    this._audioWindow = null;
  }

  // _onData(chunk) {
  //   if (this._audioWindow && this._ready) {
  //     this._audioWindow.webContents.send('data', chunk);
  //   }
  // }

  _destroySubProcess() {
    if (this._audioSubProcess) {
      this._audioSubProcess.destroy();
    }
  }

  destroy() {
    // this._destroySubProcess();
    this._destroyAudioWindow();

    // this._audioSubProcess = null;

    super.destroy();
  }
}
