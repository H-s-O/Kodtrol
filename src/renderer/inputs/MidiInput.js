import JZZ from 'jzz';
import midi from 'midi';

export default class MidiInput {
  input = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    this.messageCallback = messageCallback;
    
    this.create();
  }
  
  create = () => {
    try {
      this.input = new midi.input();
      this.input.on('message', this.onMessage);
      if (this.input.getPortCount()) {
        // temp: open first available port
        console.log('midi ports', this.input.getPortCount());
        this.input.openPort(0);
        // @TODO enable Active Sensing messages for device status detect ?
        // this.input.ignoreTypes(true, true, false);
      }
      console.log('MIDI input');
    } catch (e) {
      console.error(e);
      // Retry after delay
      setTimeout(this.create, 500);
    }
  }
  
  onMessage = (deltaTime, message) => {
    if (this.messageCallback) {
      const midiMessage = new JZZ.MIDI(message);
      this.messageCallback(midiMessage);
    }
  }
  
  destroy = () => {
    if (this.input) {
      this.input.closePort();
    }
    this.input = null;
  }
}
