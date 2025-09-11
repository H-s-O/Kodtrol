import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class ArtnetOutput extends AbstractOutput {
  static _internalId = 0;

  _internalName = null;
  _output = null;

  constructor(address, universe) {
    super();

    this._internalName = 'artnet' + (ArtnetOutput._internalId++);

    this._output = new DMX();
    this._output.addUniverse(this._internalName, 'artnet', address, { universe: universe - 1 });
    console.log('Art-Net output', address, universe);
  }

  _refreshStatus() {
    if (!this._output) {
      this._setStatusInitial();
      return;
    }

    try {
      // Kinda hackish, but the dmx lib does not explicitly expose this
      if (this._output.universes[this._internalName]
        && this._output.universes[this._internalName].dev
        && this._output.universes[this._internalName].dev.remoteAddress()) { // @TODO upgrade electron, so we have access to remoteAddress() for UDP
        this._setStatusConnected();
      }
    } catch (err) {
      // The remoteAddress() method will throw if not connected
      this._setStatusDisconnected();
    }
  }

  send(data) {
    this._output.update(this._internalName, data);
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
