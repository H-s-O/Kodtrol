import JZZ from 'jzz';

export default class MidiInput {
  input = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    this.messageCallback = messageCallback;
    
    this.input = JZZ()
      .openMidiIn()
      .or('Cannot open MIDI In port!')
      .and(function() { console.log('MIDI', this.name()); })
      .connect(this.onMessage);
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
