import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class ArtnetOutput extends AbstractOutput {
  output = null;
  
  constructor(address) {
    super();
    
    this.output = new DMX();
    this.output.addUniverse('main', 'artnet', address);
    console.log('Art-Net output');
  }

  _refreshStatus = () => {
    if (!this.output) {
      this._setStatusInitial();
      return;
    }

    try {
      // Kinda hackish, but the dmx lib does not explicitly expose this
      if (this.output.universes['main']
        && this.output.universes['main'].dev
        && this.output.universes['main'].dev.remoteAddress()) { // @TODO upgrade electron, so we have access to remoteAddress() for UDP
        this._setStatusConnected();
      }
    } catch (err) {
      // The remoteAddress() method will throw if not connected
      this._setStatusDisconnected();
    }
  }
  
  send = (data) => {
    this.output.update('main', data);
  }
  
  destroy = () => {
    if (this.output) {
      // Manually stop universes
      Object.values(this.output.universes).forEach((universe) => universe.stop());
    }
    
    this.output = null;
  }
}