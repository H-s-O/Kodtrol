import DmxOutput from '../outputs/DmxOutput';
import ArtnetOutput from '../outputs/ArtnetOutput';

export default class Output {
  _status = 0;
  _type = null;
  _extraData = null;
  _output = null;
  
  constructor(sourceOutput) {
    this.update(sourceOutput);
  }
  
  update = (sourceOutput) => {
    const {
      type,
      extraData,
    } = sourceOutput;
    
    this._type = type;
    this._extraData = extraData;
    
    this.setOutput(type, extraData);
  }
  
  setOutput = (type, extraData) => {
    let output = null;
    
    if (type === 'dmx') {
      const { subType, port } = extraData;
      output = new DmxOutput(subType, port);
    } else if (type === 'artnet') {
      const { address } = extraData;
      output = new ArtnetOutput(address);
    }
    
    this._output = output;
  }
  
  get status() {
    return this._status;
  }
  
  get type() {
    return this._type;
  }
  
  send = (data) => {
    if (this._output) {
      this._output.send(data);
    }
  }
  
  destroy = () => {
    if (this._output) {
      this._output.destroy();
    }
  }
}