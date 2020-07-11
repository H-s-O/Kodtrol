import { DAC } from '@laser-dac/core';
import { Scene, Rect } from '@laser-dac/draw';
import { EtherDream } from '@laser-dac/ether-dream';
import { Laserdock } from '@laser-dac/laserdock';

import AbstractOutput from './AbstractOutput';

export default class IldaOutput extends AbstractOutput {
  _driver = null;
  _output = null;
  _scene = null;

  constructor(driver, address) {
    super();

    this._driver = driver;

    this._output = new DAC();
    switch (driver) {
      case 'ether-dream':
        this._output.use(new EtherDream())
        break;
      case 'laserdock':
        this._output.use(new Laserdock());
        break;
      default:
        throw new Error(`Unknown ILDA driver "${driver}"`);
        break;
    }
    this._output.start().then(this._onOutputStarted.bind(this));
  }

  _refreshStatus() {
    if (!this._output) {
      this._setStatusInitial();
      return;
    }

    // Kinda hackish, but the DAC lib does not explicitly expose this
    if (this._output.devices
      && this._output.devices.length
      && this._output.devices[0].connection
      && this._output.devices[0].connection.client
      && this._output.devices[0].connection.client.remoteAddress) {
      console.log('client.destroyed', this._output.devices[0].connection.client.destroyed)
      this._setStatusConnected();
    } else {
      this._setStatusDisconnected();
    }
  }

  _onOutputStarted(started) {
    console.log('ILDA output', started)
    if (started) {
      this._scene = new Scene();
      this._output.stream(this._scene, 20000) // @TODO

      this._setStatusConnected();
    } else {
      this._setStatusDisconnected();
    }
  }

  send(data) {
    if (this._scene) {
      this._scene.reset();

      let hasObject = false;
      for (const deviceId in data) {
        const deviceObjects = data[deviceId];
        const len = deviceObjects.length;
        for (let i = 0; i < len; i++) {
          hasObject = true;
          const obj = deviceObjects[i]
          this._scene.add(obj);
        }
      }

      // As a "keep-alive" for the Ether Dream, send a sufficiently large invisible shape
      if (this._driver === 'ether-dream' && !hasObject) {
        this._scene.add(new Rect({ x: 0, y: 0, width: 1, height: 1, color: [0, 0, 0] }))
      }
    }
  }

  destroy() {
    if (this._output) {
      this._output.stop();
    }
    if (this._scene) {
      this._scene.stop();
    }

    this._driver = null;
    this._output = null;
    this._scene = null;

    super.destroy();
  }
}
