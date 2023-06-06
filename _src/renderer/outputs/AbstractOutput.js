import EventEmitter from 'events';

import { IO_CONNECTED, IO_DISCONNECTED, IO_ACTIVITY } from '../../common/js/constants/io';

export default class AbstractOutput extends EventEmitter {
  static RETRY_DELAY = 1000;

  _status = null;
  _sent = false;

  get status() {
    return this._status;
  }

  refreshAndGetStatus() {
    this._refreshStatus();
    return this._status;
  }

  _refreshStatus() {
    // implement in subclass
  }

  _setStatusInitial() {
    this._status = null;
    this._sent = false;
  }

  _setStatusConnected() {
    this._status = IO_CONNECTED;
  }

  _setStatusDisconnected() {
    this._status = IO_DISCONNECTED;
    this._sent = false;
  }

  _setStatusActivity() {
    this._status = IO_ACTIVITY;
  }

  _setSent() {
    this._sent = true;
  }

  _resetSent() {
    this._sent = false;
  }

  destroy() {
    this._status = null;
    this._sent = null;
  }
}
