import { Output } from 'midi';

import AbstractOutput from './AbstractOutput';

export default class MidiOutput extends AbstractOutput {
  _output = null;
  _device = null;
  _sent = false;

  constructor(device) {
    super();

    this._device = device;

    this._create();
  }

  _create = () => {
    if (!this._output) {
      this._output = new Output();
    }

    const portIndex = this._getPortIndex();
    if (portIndex === null) {
      // Device port not found
      this._setStatusDisconnected();
      this._retry();
      return;
    }

    this._output.openPort(portIndex);

    console.log(`Connected to MIDI output "${this._device}"`);
    this._setStatusConnected();
  }

  _retry = () => {
    // Retry after delay
    setTimeout(this._create.bind(this), MidiOutput.RETRY_DELAY);
  }

  _getPortIndex = () => {
    if (this._output) {
      const portCount = this._output.getPortCount();
      for (let i = 0; i < portCount; i++) {
        if (this._output.getPortName(i) === this._device) {
          return i;
        }
      }
    }

    return null;
  }

  _refreshStatus = () => {
    if (!this._output) {
      this._setStatusDisconnected();
      return;
    }

    if (this._getPortIndex() === null) {
      console.log(`Disconnected from MIDI output "${this._device}"`);
      this._setStatusDisconnected();
      this._retry();
      return;
    }

    if (this._sent) {
      // Reset flag
      this._sent = false;
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
  }

  send = (data) => {
    if (this._output) {
      let hasMessage = false;
      for (const deviceId in data) {
        const deviceMessages = data[deviceId];
        const len = deviceMessages.length;
        for (let i = 0; i < len; i++) {
          hasMessage = true;
          const message = deviceMessages[i];
          this._output.sendMessage(message);
        }
      }

      if (hasMessage) {
        this._sent = true;
      }
    }
  }

  _destroyOutput = () => {
    if (this._output) {
      this._output.closePort();
    }
  }

  destroy = () => {
    this._destroyOutput();

    this._output = null;
    this._device = null;
    this._sent = null;

    super.destroy();
  }
}
