import { app, BrowserWindow } from 'electron';

export default class AudioRenderer {
  audioWindow = null;
  contents = null;
  ready = false;
  
  constructor() {
    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onWindowAllClosed);
    // app.on('will-quit', this.onWillQuit);
    
    process.on('exit', this.onExit);
    
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', this.onData);
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
  
  onExit = () => {
    this.destroyAudioWindow();
  }
}