import BaseRootRenderer from './BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
// import AudioRenderer from '../items/AudioRenderer';
import timeToPPQ from '../../../lib/timeToPPQ';

export default class RootBoardRenderer extends BaseRootRenderer {
  _board = null;
  _blocks = null;
  _audios = null;
  _activeItems = {};
  _itemsMap = null;
  
  constructor(providers, boardId) {
    super(providers);
    
    this._setBoardAndItems(boardId);
  }
  
  _setBoardAndItems = (boardId) => {
    this._board = this._providers.getBoard(boardId);
    this._board.on('updated', this._onBoardUpdated);

    this._build();
  }

  _onBoardUpdated = () => {
    // "Rebuild" board

    Object.values(this._blocks).forEach((block) => block.instance.destroy());

    this._blocks = null;
    this._itemsMap = null;

    this._build();
  }

  _build = () => {
    // "Prepare" data
    const layersById = this._board.layers.reduce((obj, layer) => {
      return {
        ...obj,
        [layer.id]: layer,
      }
    }, {});
    
    // Extract board items
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
            localBeatPos: -1,
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
  
  get board() {
    return this._board;
  }
  
  get activeItems() {
    return this._activeItems;
  }

  _getRenderingTempo = () => {
    return this._board.tempo;
  }

  setActiveItems = (activeItems) => {
    this._activeItems = activeItems;
  }

  _runFrame = (frameTime) => {
    const boardItems = this._getBoardActiveItems();
    if (boardItems === null) {
      // Nothing to render
      return;
    }

    const currentTime = this._currentTime;

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      block.instance.render(currentTime);
    }
    
    // const medias = boardItems[1];
    // const mediaCount = medias.length;
    // for (let i = 0; i < mediaCount; i++) {
    //   const media = this._audios[medias[i]];
    //   media.instance.render(currentTime, mediaInfo);
    // }
  }

  _runBeat = (beatPos) => {
    const boardItems = this._getBoardActiveItems();
    if (boardItems === null) {
      return;
    }

    const tempo = this._getRenderingTempo();
    const currentTime = this._currentTime;

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      const localBeatPos = timeToPPQ(currentTime, tempo);
      if (localBeatPos !== block.localBeatPos) {
        block.instance.beat(beatPos, localBeatPos);
        block.localBeatPos = localBeatPos;
      }
    }
  }
  
  _runInput = (type, data) => {
    const boardItems = this._getBoardActiveItems();
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
  
  _getBoardActiveItems = () => {
    const activeItems = this._activeItems;
    const itemsMap = this._itemsMap;
    const items = [
      itemsMap[0].filter((id) => id in activeItems),
      itemsMap[1].filter((id) => id in activeItems),
    ];
    return items;
  }

  resetBlocks = () => {
    Object.values(this._blocks).forEach((block) => block.instance.reset());
  }

  // resetAudios = () => {
  //   Object.values(this._audios).forEach((audio) => audio.instance.reset());
  // }

  destroy = () => {
    if (this._board) {
      this._board.removeAllListeners();
    }
    
    Object.values(this._blocks).forEach((block) => block.instance.destroy());

    this._blocks = null;
    // this._audios = null;
    this._itemsMap = null;
    this._board = null;

    // super.destroy(); // @TODO needs babel update
  }
}
