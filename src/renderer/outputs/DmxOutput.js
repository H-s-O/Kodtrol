import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class DmxOutput extends AbstractOutput {
  _output = null;

  constructor(driver, port) {
    super();

    this._output = new DMX();
    this._output.addUniverse('main', driver, port);
    console.log('DMX output', driver, port);
  }

  _refreshStatus() {
    if (!this._output) {
      this._setStatusInitial();
      return;
    }

    // Kinda hackish, but the dmx lib does not explicitly expose this
    if (this._output.universes['main']
      && this._output.universes['main'].dev
      && this._output.universes['main'].dev.isOpen) {
      this._setStatusConnected();
    } else {
      this._setStatusDisconnected();
    }
  }

  send(data) {
    this._output.update('main', data);
  }

  _destroyOutput() {
    if (this._output) {
      // Manually stop universes
      Object.values(this._output.universes).forEach((universe) => universe.stop());
    }
  }

  destroy() {
    this._destroyOutput();

    this._output = null;

    super.destroy();
  }
}
