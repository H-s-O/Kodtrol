import { IO_CONNECTED, IO_DISCONNECTED, IO_ACTIVITY } from '../../common/js/constants/io';

export default class AbstractInput {
  static RETRY_DELAY = 1000;

  _status = null;
  _received = false;

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
    this._received = false;
  }

  _setStatusConnected() {
    this._status = IO_CONNECTED;
  }

  _setStatusDisconnected() {
    this._status = IO_DISCONNECTED;
    this._received = false;
  }

  _setStatusActivity() {
    this._status = IO_ACTIVITY;
  }

  _setReceived() {
    this._received = true;
  }

  _resetReceived() {
    this._received = false;
  }

  destroy() {
    this._status = null;
    this._received = null;
  }
}
