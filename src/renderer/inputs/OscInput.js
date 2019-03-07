import moscow from 'moscow';

export default class OscInput {
  server = null;
  messageCallback = null;
  
  constructor(messageCallback, port) {
    this.messageCallback = messageCallback;
    
    this.server = moscow.createServer(port, 'udp');
    this.server.on('message', this.onMessage);
    this.server.start();
    console.log('OSC input');
  }
  
  onMessage = (address, args) => {
    const obj = {
      address,
      args,
    };
    
    this.messageCallback(obj);
  }
  
  destroy = () => {
    if (this.server) {
      this.server.stop();
    }
    this.server = null;
  }
}
