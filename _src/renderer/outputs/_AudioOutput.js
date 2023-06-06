import AudioSubProcess from '../process/AudioSubProcess';
import AbstractOutput from './AbstractOutput';

export default class AudioOutput extends AbstractOutput {
  _audioSubProcess = null;

  constructor(device) {
    super();

    // @TODO handle different audio output devices
    this._audioSubProcess = new AudioSubProcess();
    this._audioSubProcess.once('ready', this._onSubProcessReady.bind(this));
    console.log('Audio output', device);

  }

  _onSubProcessReady() {
    this.emit('ready');
    this._setStatusConnected();
  }

  send(data) {
    if (this._audioSubProcess) {
      this._audioSubProcess.send(data);
      this._setSent();
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

  _destroySubProcess() {
    if (this._audioSubProcess) {
      this._audioSubProcess.destroy();
    }
  }

  destroy() {
    this._destroySubProcess();

    this._audioSubProcess = null;

    super.destroy();
  }
}
