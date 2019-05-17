import { app, BrowserWindow } from 'electron';

export default class AudioRenderer {
  audioWindow = null;
  contents = null;
  ready = false;
  
  constructor() {
    // Set the Autoplay Policy to not require user interaction;
    // this allows us to play audio normally
    // @see https://github.com/electron/electron/issues/13525#issuecomment-410923391
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    
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
    this.audioWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        webSecurity: false,
      },
    });
    this.audioWindow.loadURL('http://localhost:8080/audio/index.html');
    this.contents = this.audioWindow.webContents;
    this.contents.once('did-finish-load', this.onFinishLoad);
  }
  
  onFinishLoad = () => {
    this.ready = true;
  }
  
  destroyAudioWindow = () => {
    if (this.audioWindow) {
      this.audioWindow.removeAllListeners();
      this.audioWindow.close();
    }
    this.audioWindow = null;
  }
  
  onData = (chunk) => {
    if (this.ready) {
      this.contents.send('data', chunk);
    }
  }
}