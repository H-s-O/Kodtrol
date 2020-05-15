import { IO_CONNECTED, IO_DISCONNECTED, IO_ACTIVITY } from '../../common/js/constants/io';

export default class AbstractOutput {
  static RETRY_DELAY = 1000;

  _status = null;

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
  }

  _setStatusConnected() {
    this._status = IO_CONNECTED;
  }

  _setStatusDisconnected() {
    this._status = IO_DISCONNECTED;
  }

  _setStatusActivity() {
    this._status = IO_ACTIVITY;
  }

  destroy() {
    this._status = null;
  }
}
