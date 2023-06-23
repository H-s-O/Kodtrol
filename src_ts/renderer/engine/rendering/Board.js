import EventEmitter from 'events';

export default class Board extends EventEmitter {
  _id = null;
  _tempo = 0;
  _layers = [];
  _items = [];
  _hash = null;

  constructor(sourceBoard) {
    super();

    this.update(sourceBoard);
  }

  update(sourceBoard) {
    const {
      id,
      layers,
      items,
      tempo,
      hash,
    } = sourceBoard;

    this._id = id;
    this._layers = layers;
    this._items = items;
    this._tempo = Number(tempo);
    this._hash = hash;

    this.emit('updated');
  }

  get id() {
    return this._id;
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
    this._layers = null;
    this._items = null;
    this._hash = null;
  }
}
