import { UDPPort, TCPSocketPort } from 'osc';

import AbstractInput from './AbstractInput';

export default class OscInput extends AbstractInput {
  _server = null;
  _messageCallback = null;
  _port = null;
  _protocol = null;

  constructor(messageCallback, protocol, port) {
    super();

    this._messageCallback = messageCallback;
    this._protocol = protocol;
    this._port = port;

    this._create();
  }

  _create() {
    try {
      if (this._protocol === 'tcp') {
        this._server = new TCPSocketPort({
          localAddress: '0.0.0.0',
          localPort: this._port,
          metadata: true,
        })
      } else if (this._protocol === 'udp') {
        this._server = new UDPPort({
          localAddress: '0.0.0.0',
          localPort: this._port,
          metadata: true,
        })
      }
      this._server.on('osc', this._onOSC.bind(this));
      this._server.open();

      this._setStatusConnected();
      console.log('OscInput _create()', this._port);
    } catch (e) {
      console.error('OscInput _create() error', e);
      this._setStatusDisconnected();
      // Retry after delay
      setTimeout(this._create.bind(this), OscInput.RETRY_DELAY);
    }
  }

  _refreshStatus() {
    if (!this._server) {
      this._setStatusInitial();
      return;
    }

    if (this._received) {
      // Reset flag
      this._resetReceived();
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
  }

  _onOSC(packet, info) {
    this._setReceived();
    this._messageCallback(packet);
  }

  _destroyServer() {
    if (this._server) {
      this._server.removeAllListeners();
      this._server.close();
    }
  }

  destroy() {
    this._destroyServer();

    this._server = null;
    this._messageCallback = null;
    this._port = null;
    this._protocol = null;

    super.destroy();
  }
}
