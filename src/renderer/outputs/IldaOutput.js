import { DAC } from '@laser-dac/core';
import { Scene, Rect } from '@laser-dac/draw';
import { EtherDream } from '@laser-dac/ether-dream';
import { Laserdock } from '@laser-dac/laserdock';

import AbstractOutput from './AbstractOutput';

export default class IldaOutput extends AbstractOutput {
  _driver = null;
  _rate = null;
  _address = null;
  _output = null;
  _scene = null;
  _started = false;

  constructor(driver, rate, address) {
    super();

    this._driver = driver;
    this._rate = rate;
    this._address = address;

    this._create();
  }

  _create() {
    console.log('IldaOutput _create', this._driver, this._rate, this._address);

    if (!this._output) {
      this._output = new DAC();
    }

    this._destroyOutputDevice();

    if (this._driver === 'ether-dream') {
      // @TODO hack something with process.env.ETHER_ADDRESS for custom IP
      this._output.use(new EtherDream())
    } else if (this._driver === 'laserdock') {
      this._output.use(new Laserdock());
    }

    this._output.start()
      .then(this._onOutputStarted.bind(this))
      .catch(this._onOutputStartError.bind(this));
  }

  _onOutputStartError(err) {
    console.error('IldaOutput _create() error', err);
    this._setStatusDisconnected();
    setTimeout(this._create.bind(this), IldaOutput.RETRY_DELAY);
  }

  _onOutputStarted(started) {
    if (started) {
      console.log('IldaOutput connected');

      this._started = true;

      this._scene = new Scene();
      this._output.stream(this._scene, this._rate * 1000);

      this._setStatusConnected();
    } else {
      console.error('IldaOutput failed to start');

      this._started = false;
      this._setStatusDisconnected();

      setTimeout(this._create.bind(this), IldaOutput.RETRY_DELAY);
    }
  }

  _getConnectionActive() {
    if (this._driver === 'ether-dream') {
      // Kinda hackish, but the Ether Dream driver does not explicitly exposes this
      if (this._output
        && this._output.devices
        && this._output.devices.length
        && this._output.devices[0].connection
        && this._output.devices[0].connection.client
        && this._output.devices[0].connection.client.remoteAddress) {
        return true;
      }
    } else if (this._driver === 'laserdock') {
      // Very innacurate, but there's no way to check for device availability in the Laserdock driver
      // and attempting to call any "init" native function of the driver after a device is disconnected results
      // in a hard crash; so for now we mark a connection as permanently active once it's working.
      if (this._output) {
        return this._started;
      }
    }
    return false;
  }

  _refreshStatus() {
    if (!this._output) {
      this._setStatusInitial();
      return;
    }

    if (!this._getConnectionActive()) {
      this._setStatusDisconnected();
      if (this._started) {
        this._create();
      }
      return;
    }

    if (this._sent) {
      // Reset flag
      this._resetSent();
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
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
        hasObject = true;
      }

      if (hasObject) {
        this._setSent();
      }
    }
  }

  _destroyOutputDevice() {
    if (this._output) {
      this._output.stop();
      this._output.removeAll();
    }

    this._started = false;
  }

  destroy() {
    if (this._scene) {
      this._scene.stop();
    }

    this._destroyOutputDevice();

    this._driver = null;
    this._address = null;
    this._output = null;
    this._scene = null;
    this._started = null;

    super.destroy();
  }
}
