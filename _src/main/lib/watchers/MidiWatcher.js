import EventEmitter from 'events';
import { Input, Output } from 'midi';

import * as WatcherEvent from './../../events/WatcherEvent';

export default class MidiWatcher extends EventEmitter {
  _input = null;
  _output = null;
  // _inputs = [];
  // _outputs = [];
  _interval = null;

  constructor() {
    super();

    this._input = new Input();
    this._output = new Output();

    this._interval = setInterval(this._doCheck, 1000);
  }

  _doCheck = () => {
    const inputCount = this._input.getPortCount();
    const inputs = [];
    for (let i = 0; i < inputCount; i++) {
      const name = this._input.getPortName(i);
      inputs.push({ id: name, name })
    }

    const outputCount = this._output.getPortCount();
    const outputs = [];
    for (let i = 0; i < outputCount; i++) {
      const name = this._output.getPortName(i);
      outputs.push({ id: name, name })
    }

    this.emit(WatcherEvent.UPDATE, inputs, outputs);
  }
}
