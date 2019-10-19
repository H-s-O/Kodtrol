import { UDPPort, TCPSocketPort } from 'osc';

import AbstractInput from './AbstractInput';

export default class OscInput extends AbstractInput {
  server = null;
  messageCallback = null;
  port = null;
  protocol = null
  
  constructor(messageCallback, protocol, port) {
    super();

    this.messageCallback = messageCallback;
    this.protocol = protocol;
    this.port = port;
    
    this.create();
  }
  
  create = () => {
    try {
      if (this.protocol === 'tcp') {
        this.server = new TCPSocketPort({
          localAddress: '0.0.0.0',
          localPort: this.port,
          metadata: true,
        })
      } else if (this.protocol === 'udp') {
        this.server = new UDPPort({
          localAddress: '0.0.0.0',
          localPort: this.port,
          metadata: true,
        })
      }
      this.server.on('osc', this.onOSC);
      this.server.open();

      this._setStatusConnected();
      console.log('OSC input');
    } catch (e) {
      console.error(e);
      this._setStatusDisconnected();
      // Retry after a delay
      setTimeout(this.create, 500);
    }
  }
  
  onOSC = (packet, info) => {
    this.messageCallback(packet);
  }
  
  destroy = () => {
    if (this.server) {
      this.server.removeAllListeners();
      this.server.close();
    }
    this.server = null;
  }
}
