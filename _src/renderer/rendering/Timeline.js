import EventEmitter from 'events';

export default class Timeline extends EventEmitter {
  _id = null;
  _tempo = 0;
  _duration = 0;
  _inTime = 0;
  _outTime = 0;
  _layers = [];
  _items = [];
  _hash = null;

  constructor(sourceTimeline) {
    super();

    this.update(sourceTimeline);
  }

  update(sourceTimeline) {
    const {
      id,
      duration,
      inTime,
      outTime,
      layers,
      items,
      tempo,
      hash
    } = sourceTimeline;

    this._id = id;
    this._duration = Number(duration);
    this._inTime = Number(inTime);
    this._outTime = Number(outTime);
    this._layers = layers;
    this._items = items;
    this._tempo = Number(tempo);
    this._hash = hash;

    this.emit('updated');
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

  get hash() {
    return this._hash;
  }

  destroy() {
    this._id = null;
    this._tempo = null;
    this._duration = null;
    this._inTime = null;
    this._outTime = null;
    this._layers = null;
    this._items = null;
    this._hash = null;
  }
}
