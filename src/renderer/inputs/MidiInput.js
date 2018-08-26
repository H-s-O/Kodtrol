import midi from 'midi';
import MIDIMessage from 'midimessage';

export default class MidiInput {
  input = null;
  messageCallback = null;
  
  constructor(messageCallback) {
    this.messageCallback = messageCallback;
    
    this.input = new midi.input();
    this.input.on('message', this.onMessage);
    console.log('MidiInput', this.input.getPortCount());
    this.input.openPort(0);
  }
  
  onMessage = (deltaTime, message) => {
    const fakeEvent = {
      data: message,
      receivedTime: Date.now(),
    };
    const parsedMessage = MIDIMessage(fakeEvent);
    
    this.messageCallback(parsedMessage);
  }
  
  destroy = () => {
    if (this.input) {
      this.input.closePort();
    }
    this.input = null;
  }
}