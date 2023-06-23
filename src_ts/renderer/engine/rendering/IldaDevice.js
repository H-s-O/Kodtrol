import { basename, join } from 'path';
import glob from 'glob';
import { Path, Rect, Line, Circle, HersheyFont, loadHersheyFont } from '@laser-dac/draw';

import AbstractDevice from './AbstractDevice';

const FONTS_DIR = join(__dirname, '..', 'hershey_fonts');
const FONTS = glob.sync(join(FONTS_DIR, '*.jhf')).reduce((obj, fontPath) => {
  const name = basename(fontPath, '.jhf');
  obj[name] = loadHersheyFont(fontPath);
  return obj;
}, {});

export default class IldaDevice extends AbstractDevice {
  _pps = null;
  _objects = [];

  constructor(providers, sourceDevice) {
    super(providers);

    this.update(sourceDevice);
  }

  update(sourceDevice) {
    super.update(sourceDevice);

    const {
      pps,
    } = sourceDevice;

    this._pps = parseInt(pps);
  }

  get pointsPerSecond() {
    return this._pps;
  }

  reset() {
    this._objects = [];
  }

  sendDataToOutput() {
    // Guard
    if (this._output) {
      const data = {
        [this._id]: this._objects,
      };

      this._output.buffer(data);
    }
  }

  addPath(data) {
    this._objects.push(new Path(data));
  }

  addRect(data) {
    this._objects.push(new Rect(data));
  }

  addLine(data) {
    this._objects.push(new Line(data));
  }

  addCircle(data) {
    this._objects.push(new Circle(data));
  }

  addText(data) {
    // Guard
    if (!(data.font in FONTS)) {
      throw new Error(`Font "${data.font}" does not exists`);
    }
    const font = FONTS[data.font];
    this._objects.push(new HersheyFont({ ...data, font }))
  }

  destroy() {
    this._pps = null;
    this._objects = null;

    super.destroy();
  }
};
