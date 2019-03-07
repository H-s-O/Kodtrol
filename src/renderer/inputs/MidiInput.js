import JZZ from 'jzz';

export default class MidiInput {
  input = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    this.messageCallback = messageCallback;
    
    this.input = JZZ()
      .or('Cannot start MIDI engine!')
      .and(function() { console.log(this.info()); })
      .openMidiIn()
      .or('Cannot open MIDI In port!')
      .and(function() { console.log(this.name()); })
      .connect(this.onMessage);
    console.log('MIDI input');
  }
  
  onMessage = (message) => {
    // Ignore active sensing messages
    // (maybe use as a device disconnected detection?)
    if (message.length === 1 && '0' in message && message['0'] === 0xFE) {
      return;
    }

    if (this.messageCallback) {
      this.messageCallback(message);
    }
  }
  
  destroy = () => {
    if (this.input) {
      this.input
        .disconnect()
        .and(function() { this.close(); });
    }
    this.input = null;
  }
}
