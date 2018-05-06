import { get } from 'lodash';
import TimelineBlock from './TimelineBlock';

export default class Timeline {
  constructor() {
    this.id = null;
    this.name = null;
    this.tempo = 0;
    this.duration = 0;
    this.inTime = 0;
    this.outTime = 0;
    this.layers = [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tempo: this.tempo,
      duration: this.duration,
      inTime: this.inTime,
      outTime: this.outTime,
      layers: this.layers,
    };
  }

  static fromJSON(json) {
    
  }
}
