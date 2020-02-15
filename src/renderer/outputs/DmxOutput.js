import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class DmxOutput extends AbstractOutput {
  output = null;
  
  constructor(driver, port) {
    super();

    this.output = new DMX();
    this.output.addUniverse('main', driver, port);
    console.log('DMX output');
  }

  _refreshStatus = () => {
    if (!this.output) {
      this._setStatusInitial();
      return;
    }

    // Kinda hackish, but the dmx lib does not explicitly expose this
    if (this.output.universes['main']
      && this.output.universes['main'].dev
      && this.output.universes['main'].dev.isOpen) {
      this._setStatusConnected();
    } else {
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
