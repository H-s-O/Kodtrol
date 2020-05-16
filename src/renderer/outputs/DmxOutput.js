import DMX from 'dmx';

import AbstractOutput from './AbstractOutput';

export default class DmxOutput extends AbstractOutput {
  _output = null;
  _driver = null;
  _port = null;
  _canCheck = false;
  _checkTimeout = null;

  constructor(driver, port) {
    super();

    this._driver = driver;
    this._port = port;

    this._create();
  }

  _create() {
    clearTimeout(this._checkTimeout);
    this._destroyOutput();

    try {
      this._output = new DMX();
      this._output.addUniverse('main', this._driver, this._port);
      console.log('DmxOutput _create()', this._driver, this._port);
      this._checkTimeout = setTimeout(() => this._canCheck = true, 3000);
    } catch (e) {
      console.error('DmxOutput _create() error', e);
      this._setStatusDisconnected();
      // Retry after delay
      setTimeout(this._create.bind(this), DmxOutput.RETRY_DELAY);
    }
  }

  _getPortOpen() {
    // Kinda hackish, but the dmx lib does not explicitly expose this
    if (this._output
      && this._output.universes['main']
      && this._output.universes['main'].dev
      && this._output.universes['main'].dev.isOpen) {
      return true;
    }

    return false;
  }

  _refreshStatus() {
    if (!this._output || !this._canCheck) {
      this._setStatusInitial();
      return;
    }

    if (!this._getPortOpen()) {
      this._setStatusDisconnected();
      this._create();
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
    if (this._output) {
      this._output.update('main', data);
      this._setSent();
    }
  }

  _destroyOutput() {
    clearTimeout(this._checkTimeout);

    if (this._output) {
      // Manually stop universes
      Object.values(this._output.universes).forEach((universe) => {
        universe.removeAllListeners();
        universe.stop();
        if (universe.dev && universe.dev.isOpen) {
          universe.dev.close();
        }
      });
    }
  }

  destroy() {
    this._destroyOutput();

    this._output = null;
    this._driver = null;
    this._port = null;
    this._canCheck = null;
    this._checkTimeout = null;

    super.destroy();
  }
}
