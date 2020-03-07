import { app, BrowserWindow } from 'electron';
import { join } from 'path';

export default class AudioRenderer {
  _audioWindow = null;
  _ready = false;

  constructor() {
    // Set the Autoplay Policy to not require user interaction;
    // this allows us to play audio normally
    // @see https://github.com/electron/electron/issues/13525#issuecomment-410923391
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

    // Do not show in macOS Dock
    app.dock.hide()

    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onWindowAllClosed);

    process.on('SIGTERM', this.onSigTerm);

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', this.onData);
  }

  onSigTerm = () => {
    this.destroyAudioWindow();
    process.exit();
  }

  onReady = () => {
    this.createAudioWindow();
  }

  onWindowAllClosed = () => {
    // Do nothing, keep the app alive
  }

  createAudioWindow = () => {
    this._audioWindow = new BrowserWindow({
      show: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    });

    this._audioWindow.loadFile(join(__dirname, '../../../../build/audio/index.html'));
    this._audioWindow.webContents.once('did-finish-load', this.onFinishLoad);
  }

  onFinishLoad = () => {
    this._ready = true;
  }

  destroyAudioWindow = () => {
    if (this._audioWindow) {
      this._audioWindow.removeAllListeners();
      this._audioWindow.close();
    }
    this._audioWindow = null;
  }

  onData = (chunk) => {
    if (this._audioWindow && this._ready) {
      this._audioWindow.webContents.send('data', chunk);
    }
  }
}
