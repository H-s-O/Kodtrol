export default class Timeline {
  _id = null;
  _tempo = 0;
  _duration = 0;
  _inTime = 0;
  _outTime = 0;
  _layers = [];
  _items = [];
  
  constructor(sourceTimeline) {
    this.update(sourceTimeline);
  }
  
  update = (sourceTimeline) => {
    const {
      id,
      duration,
      inTime,
      outTime,
      layers,
      items,
      tempo,
    } = sourceTimeline;
    
    this._id = id;
    this._duration = duration;
    this._inTime = inTime;
    this._outTime = outTime;
    this._layers = layers;
    this._items = items;
    this._tempo = tempo;
  }
  
  get id() {
    return this._id;
  }
  
  get duration() {
    return this._duration;
  }
  
  get inTime() {
    return this._inTime;
  }
  
  get outTime() {
    return this._outTime;
  }
  
  get layers() {
    return this._layers;
  }
  
  get items() {
    return this._items;
  }
  
  get tempo() {
    return this._tempo;
  }
}