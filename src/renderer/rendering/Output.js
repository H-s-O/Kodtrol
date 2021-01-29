import EventEmitter from 'events';

import DmxOutput from '../outputs/DmxOutput';
import ArtnetOutput from '../outputs/ArtnetOutput';
import IldaOutput from '../outputs/IldaOutput';
import AudioOutput from '../outputs/AudioOutput';
import MidiOutput from '../outputs/MidiOutput';
import { IO_DMX, IO_ARTNET, IO_ILDA, IO_AUDIO, IO_MIDI } from '../../common/js/constants/io';

export default class Output {
  _id = null;
  _type = null;
  _driver = null;
  _port = null;
  _address = null;
  _output = null;
  _dacRate = null;
  _bufferData = {};
  _hash = null;

  constructor(sourceOutput) {
    this.update(sourceOutput);
  }

  update(sourceOutput) {
    const {
      id,
      type,
      driver,
      port,
      address,
      dacRate,
      hash,
    } = sourceOutput;

    this._id = id;
    this._type = type;
    this._driver = driver;
    this._port = port;
    this._address = address;
    this._dacRate = dacRate;
    this._hash = hash;

    this._setOutput();
  }

  _setOutput() {
    if (this._output) {
      this._output.destroy();
    }

    let output = null;

    switch (this._type) {
      case IO_DMX:
        output = new DmxOutput(this._driver, this._port);
        break;
      case IO_ARTNET:
        output = new ArtnetOutput(this._address);
        break;
      case IO_ILDA:
        output = new IldaOutput(this._driver, this._dacRate, this._address);
        break;
      case IO_AUDIO:
        output = new AudioOutput(this._driver);
        break;
      case IO_MIDI:
        output = new MidiOutput(this._driver);
        break;
      default:
        throw new Error(`Unknown output type "${this._type}"`);
        break;
    }

    this._output = output;
  }

  get id() {
    return this._id;
  }

  get outputInstance() {
    return this._output;
  }

  get type() {
    return this._type;
  }

  get hash() {
    return this._hash;
  }

  buffer(data) {
    // @TODO handle serial/OSC output data
    this._bufferData = {
      ...this._bufferData,
      ...data,
    };
  }

  flush() {
    if (this._output) {
      this._output.send(this._bufferData);
    }
    this._bufferData = {};
  }

  destroy() {
    if (this._output) {
      if (this._output instanceof EventEmitter) {
        this._output.removeAllListeners();
      }
      this._output.destroy();
    }

    this._id = null;
    this._type = null;
    this._driver = null;
    this._port = null;
    this._address = null;
    this._output = null;
    this._dacRate = null;
    this._bufferData = null;
    this._hash = null;
  }
}
