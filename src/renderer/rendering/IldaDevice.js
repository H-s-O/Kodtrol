import { Path, Rect, Line, Circle } from '@laser-dac/draw';

import AbstractDevice from './AbstractDevice';

export default class IldaDevice extends AbstractDevice {
  _pps = null;
  _objects = [];

  constructor(providers, sourceDevice) {
    super(providers, sourceDevice);
    
    this.update(sourceDevice);
  }
  
  update = (sourceDevice) => {
    const {
      pps,
    } = sourceDevice;

    this._pps = parseInt(pps);
  }
  
  get pointsPerSecond() {
    return this._pps;
  }
  
  reset = () => {
    this._objects = [];
  }
  
  sendDataToOutput = () => {
    // Guard
    if (this._output) {
      const data = {
        [this._id]: this._objects,
      };

      this._output.buffer(data);
    }
  }
  
  addPath = (data) => {
    this._objects.push(new Path(data));
  }

  addRect = (data) => {
    this._objects.push(new Rect(data));
  }

  addLine = (data) => {
    this._objects.push(new Line(data));
  }

  addCircle = (data) => {
    this._objects.push(new Circle(data));
  }
  
  destroy = () => {
    this._pps = null;
    this._objects = null;

    // super.destroy(); // @TODO needs babel update
  }
};
