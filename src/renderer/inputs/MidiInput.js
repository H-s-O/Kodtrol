import JZZ from 'jzz';
import midi from 'midi';

import AbstractInput from './AbstractInput';

export default class MidiInput extends AbstractInput {
  input = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    super();

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
        this._setStatusConnected();
        // @TODO enable Active Sensing messages for device status detect ?
        // this.input.ignoreTypes(true, true, false);
      } else {
        this._setStatusDisconnected();
      }
      console.log('MIDI input');
    } catch (e) {
      console.error(e);
      this._setStatusDisconnected();
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
