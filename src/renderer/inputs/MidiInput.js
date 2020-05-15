import { Input } from 'midi';
import { MIDI } from 'jzz';

import AbstractInput from './AbstractInput';

export default class MidiInput extends AbstractInput {
  _input = null;
  _device = null;
  _messageCallback = null;
  _received = false;

  constructor(messageCallback, device) {
    super();

    this._messageCallback = messageCallback;
    this._device = device;

    this._create();
  }

  _create() {
    if (!this._input) {
      this._input = new Input();
    }

    const portIndex = this._getPortIndex();
    if (portIndex === null) {
      // Device port not found
      this._setStatusDisconnected();
      this._retry();
      return;
    }

    this._input.openPort(portIndex);
    this._input.on('message', this._onMessage.bind(this));

    console.log(`Connected to MIDI input "${this._device}"`);
    this._setStatusConnected();
  }

  _retry() {
    // Retry after delay
    setTimeout(this._create.bind(this), MidiInput.RETRY_DELAY);
  }

  _getPortIndex() {
    if (this._input) {
      const portCount = this._input.getPortCount();
      for (let i = 0; i < portCount; i++) {
        if (this._input.getPortName(i) === this._device) {
          return i;
        }
      }
    }

    return null;
  }

  _refreshStatus() {
    if (!this._input) {
      this._setStatusDisconnected();
      return;
    }

    if (this._getPortIndex() === null) {
      console.log(`Disconnected from MIDI input "${this._device}"`);
      this._setStatusDisconnected();
      this._retry();
      return;
    }

    if (this._received) {
      // Reset flag
      this._received = false;
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
  }

  _onMessage(deltaTime, message) {
    this._received = true;

    if (this._messageCallback) {
      const midiMessage = new MIDI(message);
      this._messageCallback(midiMessage);
    }
  }

  _destroyInput() {
    if (this._input) {
      this._input.removeAllListeners();
      this._input.closePort();
    }
  }

  destroy() {
    this._destroyInput();

    this._input = null;
    this._device = null;
    this._messageCallback = null;
    this._received = null;

    super.destroy();
  }
}
