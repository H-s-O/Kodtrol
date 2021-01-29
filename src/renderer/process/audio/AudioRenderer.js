import { app, BrowserWindow } from 'electron';
import { join } from 'path';

import { isMac } from '../../../common/js/lib/platforms';

export default class AudioRenderer {
  _audioWindow = null;
  _ready = false;

  constructor() {
    app.allowRendererProcessReuse = false;

    // Set the Autoplay Policy to not require user interaction;
    // this allows us to play audio normally
    // @see https://github.com/electron/electron/issues/13525#issuecomment-410923391
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    // Disable hardware keys for media playback control
    // @see https://github.com/electron/electron/issues/21731#issuecomment-589543405
    app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling');

    // Do not show in macOS Dock
    if (isMac) {
      app.dock.hide()
    }

    app.on('ready', this._onReady.bind(this));
    app.on('window-all-closed', this._onWindowAllClosed.bind(this));

    process.on('SIGTERM', this._onSigTerm.bind(this));

    process.on('message', this._onMessage.bind(this));
  }

  _onSigTerm() {
    this._destroyAudioWindow();
    process.exit();
  }

  _onReady() {
    this._createAudioWindow();
  }

  _onWindowAllClosed() {
    // Do nothing, keep the app alive
  }

  _createAudioWindow() {
    this._audioWindow = new BrowserWindow({
      // show: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    });
    this._audioWindow.webContents.openDevTools();

    this._audioWindow.loadFile(join(__dirname, '..', '..', '..', '..', 'build', 'audio', 'index.html'));
    this._audioWindow.webContents.once('did-finish-load', this._onFinishLoad.bind(this));
  }

  _onFinishLoad() {
    this._ready = true;
    process.stdout.write('ready');
  }

  _destroyAudioWindow() {
    if (this._audioWindow) {
      this._audioWindow.removeAllListeners();
      this._audioWindow.close();
    }
    this._audioWindow = null;
  }

  _onMessage(message) {
    if (this._audioWindow && this._ready) {
      this._audioWindow.webContents.send('data', message);
    }
  }
}
