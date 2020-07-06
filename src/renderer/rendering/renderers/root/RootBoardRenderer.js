import BaseRootRenderer from './BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
// import AudioRenderer from '../items/AudioRenderer';
import timeToPPQ from '../../../lib/timeToPPQ';
import { ITEM_SCRIPT, ITEM_MEDIA } from '../../../../common/js/constants/items';

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

  _setBoardAndItems(boardId) {
    this._board = this._providers.getBoard(boardId);
    this._board.on('updated', this._onBoardUpdated.bind(this));

    this._build();
  }

  _onBoardUpdated() {
    // "Rebuild" board

    Object.values(this._blocks).forEach((block) => block.instance.destroy());

    this._blocks = null;
    this._itemsMap = null;

    this._build();
  }

  _build() {
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
      .filter(({ type }) => type === ITEM_SCRIPT)
      .reduce((obj, block) => {
        const instance = new ScriptRenderer(this._providers, block.script);
        instance.on('script_error', this._forwardEvent('script_error', { block: block.id, board: this._board.id }));

        return {
          ...obj,
          [block.id]: {
            ...block,
            instance,
            inTime: null,
            outTime: null,
            blockPercent: null,
            active: false,
          },
        };
      }, {});

    this._audios = boardItems
      .filter(({ type }) => type === ITEM_MEDIA)
      .reduce((obj, audio) => {
        return {
          ...obj,
          [audio.id]: {
            ...audio,
            instance: new AudioRenderer(this._providers, audio),
            active: false,
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

  get itemsStatus() {
    const status = {};
    if (this._blocks !== null) {
      for (let id in this._blocks) {
        const block = this._blocks[id];
        if (block.blockPercent !== null) {
          status[block.id] = block.blockPercent;
        }
      }
    }
    return status;
  }

  _getRenderingTempo() {
    return this._board.tempo;
  }

  setActiveItems(activeItems) {
    const currentTime = this._currentTime;

    Object.entries(this._blocks).forEach(([id, block]) => {
      if (id in activeItems) {
        if (!block.active) {
          block.inTime = currentTime;
          block.outTime = null;
          block.blockPercent = null;
          block.active = true;
        }
      } else {
        if (block.active) {
          if ((typeof block.leadOutTime !== 'undefined' && block.leadOutTime !== null) && block.outTime === null) {
            block.outTime = currentTime;
          } else {
            block.active = false;
            block.blockPercent = null;
          }
        }
      }
    });

    this._activeItems = activeItems;
  }

  _runFrame(frameTime) {
    const boardItems = this._getBoardRunningItems();
    if (boardItems === null) {
      // Nothing to render
      return;
    }

    const currentTime = this._currentTime;

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      const { inTime, outTime, leadInTime, leadOutTime } = block;
      const trueLeadInTime = typeof leadInTime !== 'undefined' && leadInTime !== null ? leadInTime : null;
      const trueLeadOutTime = typeof leadOutTime !== 'undefined' && leadOutTime !== null ? leadOutTime : null;
      let blockPercent;
      if (trueLeadInTime !== null && inTime !== null && currentTime < (inTime + trueLeadInTime)) {
        blockPercent = ((currentTime - inTime - trueLeadInTime) / trueLeadInTime);
      } else if (trueLeadOutTime !== null && outTime !== null && currentTime > outTime) {
        blockPercent = ((currentTime - outTime + trueLeadOutTime) / trueLeadOutTime);
      } else {
        blockPercent = 1;
      }
      if (blockPercent <= 2) {
        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent,
        };

        block.instance.render(currentTime, blockInfo);

        block.blockPercent = blockPercent;
      } else {
        block.active = false;
        block.blockPercent = null;
      }
    }

    // const medias = boardItems[1];
    // const mediaCount = medias.length;
    // for (let i = 0; i < mediaCount; i++) {
    //   const media = this._audios[medias[i]];
    //   media.instance.render(currentTime, mediaInfo);
    // }
  }

  _runBeat(beatTime, previousBeatTime) {
    const boardItems = this._getBoardRunningItems();
    if (boardItems === null) {
      return;
    }

    const tempo = this._getRenderingTempo();

    // @TODO handle global beat diff?
    const currentBeatPos = timeToPPQ(beatTime, tempo);

    const blocks = boardItems[0];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      const prevLocalBeatPos = timeToPPQ(previousBeatTime - block.inTime, tempo);
      const currentLocalBeatPos = timeToPPQ(beatTime - block.inTime, tempo);
      // Loop the difference between two positions; will act
      // as catch-up in case some lag occurs
      const diff = currentLocalBeatPos - prevLocalBeatPos;
      for (let j = 0; j < diff; j++) {
        block.instance.beat(currentBeatPos, prevLocalBeatPos + j);
      }
    }
  }

  _runInput(type, data) {
    let change = false;
    const updatedActiveItems = { ...this._activeItems };
    const triggerableItems = this._getBoardTriggerableItems();
    const triggerableBlocks = triggerableItems[0];
    const triggerableBlocksCount = triggerableBlocks.length;
    if (triggerableBlocksCount > 0) {
      for (let i = 0; i < triggerableBlocksCount; i++) {
        const block = this._blocks[triggerableBlocks[i]];
        // @TODO midi_note
        if (block.trigger === 'midi_cc') {
          if (data[1] === parseInt(block.triggerSource)) {
            const on = data[2] === 127;
            console.log(data[1], data[2], on);
            if (on) {
              updatedActiveItems[block.id] = true;
            } else {
              delete updatedActiveItems[block.id];
            }
            change = true
          }
        }
      }
    }
    if (change) {
      this.setActiveItems(updatedActiveItems);
    }

    const boardItems = this._getBoardRunningItems();
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

  _getBoardRunningItems() {
    const itemsMap = this._itemsMap;
    const items = [
      itemsMap[0].filter((id) => this._blocks[id].active),
      itemsMap[1].filter((id) => this._audios[id].active),
    ];
    return items;
  }

  _getBoardTriggerableItems() {
    const itemsMap = this._itemsMap;
    const items = [
      itemsMap[0].filter((id) => !!this._blocks[id].trigger),
    ];
    return items;
  }

  resetBlocks() {
    Object.values(this._blocks).forEach((block) => block.instance.reset());
  }

  // resetAudios  () {
  //   Object.values(this._audios).forEach((audio) => audio.instance.reset());
  // }

  destroy() {
    if (this._board) {
      this._board.removeAllListeners();
    }

    Object.values(this._blocks).forEach((block) => {
      block.instance.removeAllListeners();
      block.instance.destroy();
    });

    this._board = null;
    this._blocks = null;
    // this._audios = null;
    this._activeItems = null;
    this._itemsMap = null;

    super.destroy();
  }
}
