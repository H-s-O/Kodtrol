export default class Board {
  _id = null;
  _tempo = 0;
  _layers = [];
  _items = [];
  _lastUpdated = null;
  
  constructor(sourceBoard) {
    this.update(sourceBoard);
  }
  
  update = (sourceBoard) => {
    const {
      id,
      layers,
      items,
      tempo,
      lastUpdated,
    } = sourceBoard;
    
    this._id = id;
    this._layers = layers;
    this._items = items;
    this._tempo = Number(tempo);
    this._lastUpdated = Number(lastUpdated);
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
}