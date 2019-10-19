import DmxOutput from '../outputs/DmxOutput';
import ArtnetOutput from '../outputs/ArtnetOutput';
import IldaOutput from '../outputs/IldaOutput';
import AudioOutput from '../outputs/AudioOutput';

export default class Output {
  _id = null;
  _type = null;
  _extraData = null;
  _output = null;
  _bufferData = {};
  _hash = null;

  constructor(sourceOutput) {
    this.update(sourceOutput);
  }
  
  update = (sourceOutput) => {
    const {
      id,
      type,
      extraData,
      hash,
    } = sourceOutput;
    
    this._id = id;
    this._type = type;
    this._extraData = extraData;
    this._hash = hash;
    
    this.setOutput(type, extraData);
  }
  
  setOutput = (type, extraData) => {
    if (this._output) {
      this._output.destroy();
    }
    
    let output = null;
    
    if (type === 'dmx') {
      const { subType, port } = extraData;
      output = new DmxOutput(subType, port);
    } else if (type === 'artnet') {
      const { address } = extraData;
      output = new ArtnetOutput(address);
    } else if (type === 'ilda') {
      const { subType, address } = extraData;
      output = new IldaOutput(subType, address)
    } else if (type === 'audio') {
      const { device } = extraData;
      output = new AudioOutput(device);
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
  
  buffer = (data) => {
    // @TODO handle serial/OSC/MIDI output data
    this._bufferData = {
      ...this._bufferData,
      ...data,
    };
  }
  
  flush = () => {
    if (this._output) {
      this._output.send(this._bufferData);
    }
    this._bufferData = {};
  }
  
  destroy = () => {
    if (this._output) {
      this._output.destroy();
    }
    
    this._id = null;
    this._type = null;
    this._extraData = null;
    this._output = null;
    this._bufferData = null;
    this._hash = null;
  }
}