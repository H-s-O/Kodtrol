import MidiInput from '../inputs/MidiInput';
import OscInput from '../inputs/OscInput';
import { IO_MIDI, IO_OSC } from '../../common/js/constants/io';

export default class Input {
  _id = null;
  _type = null;
  _protocol = null;
  _port = null;
  _device = null;
  _hash = null;
  _onInputCallback = null;
  _input = null;

  constructor(sourceInput, onInputCallback) {
    this._onInputCallback = onInputCallback;

    this.update(sourceInput, onInputCallback);
  }

  update(sourceInput, onInputCallback) {
    const {
      id,
      type,
      protocol,
      port,
      device,
      hash,
    } = sourceInput;

    this._id = id;
    this._type = type;
    this._protocol = protocol;
    this._port = port;
    this._device = device;
    this._hash = hash;

    this._setInput();
  }

  _setInput() {
    if (this._input) {
      this._input.destroy();
    }

    let input = null;

    switch (this._type) {
      case IO_MIDI:
        input = new MidiInput(this._inputMessageCallback.bind(this), this._device);
        break;
      case IO_OSC:
        input = new OscInput(this._inputMessageCallback.bind(this), this._protocol, this._port);
        break;
      default:
        throw new Error(`Unknown input type "${this._type}"`);
        break;
    }

    this._input = input;
  }

  get id() {
    return this._id;
  }

  get inputInstance() {
    return this._input;
  }

  get type() {
    return this._type;
  }

  get hash() {
    return this._hash;
  }

  _inputMessageCallback(message) {
    if (this._onInputCallback) {
      this._onInputCallback(this._type, message);
    }
  }

  destroy() {
    if (this._input) {
      this._input.destroy();
    }

    this._id = null;
    this._type = null;
    this._protocol = null;
    this._port = null;
    this._device = null;
    this._hash = null;
    this._onInputCallback = null;
    this._input = null;
  }
}
