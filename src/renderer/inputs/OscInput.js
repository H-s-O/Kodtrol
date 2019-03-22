import moscow from 'moscow';

export default class OscInput {
  server = null;
  messageCallback = null;
  port = null;
  
  constructor(messageCallback, port) {
    this.messageCallback = messageCallback;
    this.port = port;
    
    this.create();
  }
  
  create = () => {
    try {
      this.server = moscow.createServer(this.port, 'udp');
      this.server.on('message', this.onMessage);
      this.server.start();
      console.log('OSC input');
    } catch (e) {
      console.error(e);
      // Retry after a delay
      setTimeout(this.create, 500);
    }
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
      this.server.stop(() => {}); // moscow Server expects a callback
    }
    this.server = null;
  }
}
