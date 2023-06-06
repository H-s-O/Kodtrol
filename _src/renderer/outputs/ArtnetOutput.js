import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class ArtnetOutput extends AbstractOutput {
  _output = null;

  constructor(address) {
    super();

    this._output = new DMX();
    this._output.addUniverse('main', 'artnet', address);
    console.log('Art-Net output', address);
  }

  _refreshStatus() {
    if (!this._output) {
      this._setStatusInitial();
      return;
    }

    try {
      // Kinda hackish, but the dmx lib does not explicitly expose this
      if (this._output.universes['main']
        && this._output.universes['main'].dev
        && this._output.universes['main'].dev.remoteAddress()) { // @TODO upgrade electron, so we have access to remoteAddress() for UDP
        this._setStatusConnected();
      }
    } catch (err) {
      // The remoteAddress() method will throw if not connected
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
