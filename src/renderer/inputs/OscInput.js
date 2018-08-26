import moscow from 'moscow';

export default class OscInput {
  server = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    this.messageCallback = messageCallback;
    
    // Creates a UDP server, listening on port 9000
    this.server = moscow.createServer(9000, 'udp');
    this.server.on('message', this.onMessage);
    this.server.start();
    console.log('OSC');
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