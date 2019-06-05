import ScriptRenderer from './items/ScriptRenderer';
// import AudioRenderer from './AudioRenderer';
import timeToQuarter from '../../lib/timeToQuarter';

export default class BoardRenderer {
  _rendererType = 'board';
  _providers = null;
  _board = null;
  _blocks = null;
  _audios = null;
  _activeItems = {};
  _itemsMap = null;
  _currentTime = 0;
  _currentBeatPos = -1;
  
  constructor(providers, boardId) {
    this._providers = providers;
    
    this.setBoardAndItems(boardId);
  }
  
  setBoardAndItems = (boardId) => {
    this._board = this._providers.getBoard(boardId);
    
    // "Prepare" data
    const layersById = this._board.layers.reduce((obj, layer) => {
      return {
        ...obj,
        [layer.id]: layer,
      }
    }, {});
    
    // Extract timeline items
    const boardItems = this._board.items.sort((a, b) => {
      return layersById[a.layer].order - layersById[b.layer].order;
    });
    
    
    
    this._blocks = boardItems
      .filter((item) => 'script' in item)
      .reduce((obj, block) => {
        return {
          ...obj,
          [block.id]: {
            ...block,
            instance: new ScriptRenderer(this._providers, block.script),
          },
        };
      }, {});
      
    this._audios = boardItems
      .filter((item) => 'file' in item)
      .reduce((obj, audio) => {
        return {
          ...obj,
          [audio.id]: {
            ...audio,
            instance: new AudioRenderer(this._providers, audio),
          },
        };
      }, {});
    
    const itemsMap = [
        [], // blocks
        [], // medias
       ];
    for (let id in this._blocks) {
      itemsMap[0].push(id);
    }
    for (let id in this._audios) {
      itemsMap[1].push(id);
    }
    this._itemsMap = itemsMap;
  }
  
  get rendererType() {
    return this._rendererType;
  }
  
  get board() {
    return this._board;
  }
  
  get activeItems() {
    return this._activeItems;
  }

  setActiveItems = (activeItems) => {
    this._activeItems = activeItems;
  }

  tick = (delta) => {
    this._currentTime += delta;

    const beatPos = timeToQuarter(this._currentTime, this._board.tempo);
    
    if (beatPos !== this._currentBeatPos) {
      this.beat(beatPos);
      this._currentBeatPos = beatPos;
    }
  }
  
  render = (delta) => {
    const boardItems = this.getBoardActiveItems();
    if (boardItems === null) {
      // Nothing to render
      return;
    }

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      block.instance.render(delta);
    }
    
    // const medias = boardItems[1];
    // const mediaCount = medias.length;
    // for (let i = 0; i < mediaCount; i++) {
    //   const media = this._audios[medias[i]];
    //   media.instance.render(currentTime, mediaInfo);
    // }
  }

  beat = (beatPos) => {
    const boardItems = this.getBoardActiveItems();
    if (boardItems === null) {
      return;
    }

    const boardTempo = this._board.tempo;
    const currentTime = this._currentTime;

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      block.instance.beat(beatPos, currentTime, boardTempo);
    }
  }
  
  input = (type, data) => {
    const boardItems = this.getBoardActiveItems();
    if (boardItems === null) {
      return;
    }
    
    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      block.instance.input(type, data);
    }
  }
  
  getBoardActiveItems = () => {
    const activeItems = this._activeItems;
    const itemsMap = this._itemsMap;
    const items = [
      itemsMap[0].filter((id) => id in activeItems),
      itemsMap[1].filter((id) => id in activeItems),
    ];
    return items;
  }

  // restartTimeline = () => {
  //   this.resetBlocks();
  //   // this.resetAudios();
  // }

  resetBlocks = () => {
    Object.values(this._blocks).forEach((block) => block.instance.reset());
  }

  // resetAudios = () => {
  //   Object.values(this._audios).forEach((audio) => audio.instance.reset());
  // }

  destroy = () => {
    Object.values(this._blocks).forEach((block) => block.instance.destroy());

    this._blocks = null;
    // this._audios = null;
  }
}
