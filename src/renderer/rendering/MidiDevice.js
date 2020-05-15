import { MIDI } from 'jzz';

import AbstractDevice from './AbstractDevice';

export default class MidiDevice extends AbstractDevice {
  _channel = null;
  _messages = [];

  constructor(providers, sourceDevice) {
    super(providers);

    this.update(sourceDevice);
  }

  update(sourceDevice) {
    super.update(sourceDevice);

    const {
      channel,
    } = sourceDevice;

    this._channel = parseInt(channel);
  }

  get channel() {
    return this._channel;
  }

  reset() {
    this._messages = [];
  }

  sendDataToOutput() {
    // Guard
    if (this._output) {
      const data = {
        [this._id]: this._messages,
      };

      this._output.buffer(data);
    }
  }

  _pushMidi(midi) {
    const arr = [midi[0], midi[1], midi[2]];
    this._messages.push(arr);
  }

  _getUsableChannel() {
    return this._channel - 1;
  }

  sendNoteOn(note, velocity = 127) {
    this._pushMidi(MIDI.noteOn(this._getUsableChannel(), note, velocity));
    return this;
  }

  sendNoteOff(note, velocity = 0) {
    this._pushMidi(MIDI.noteOff(this._getUsableChannel(), note, velocity));
    return this;
  }

  sendControlChange(value1, value2) {
    this._pushMidi(MIDI.control(this._getUsableChannel(), value1, value2));
    return this;
  }

  destroy() {
    this._channel = null;
    this._messages = null;

    super.destroy();
  }
};
