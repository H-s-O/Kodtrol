import BaseRootRenderer from './BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
// import AudioRenderer from '../items/AudioRenderer';
import timeToPPQ from '../../../lib/timeToPPQ';
import {
  ITEM_SCRIPT,
  ITEM_MEDIA,
  ITEM_TRIGGER_MIDI_CC,
  ITEM_TRIGGER_OSC_ADR_ARG,
  ITEM_SWITCH_MODE_MIRROR,
} from '../../../../common/js/constants/items';

const BLOCK_PHASE_IN = 'in';
const BLOCK_PHASE_RUN = 'run';
const BLOCK_PHASE_OUT = 'out';

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
        instance.on('script_log', this._forwardEvent('script_log', { block: block.id, board: this._board.id }));

        return {
          ...obj,
          [block.id]: {
            ...block,
            instance,
            phase: null,
            inTime: null,
            outTime: null,
            blockPercent: null,
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
      const { leadInTime, leadOutTime } = block;

      console.log('block switch mode', block.switchMode)

      // Block activated by user
      if (id in activeItems) {
        // Block was running a phase out
        if (block.phase === BLOCK_PHASE_OUT) {
          // Block has "mirror" switch mode
          if (block.switchMode === ITEM_SWITCH_MODE_MIRROR) {
            // Compute the offset
            const trueLeadOutTime = typeof leadOutTime !== 'undefined' && leadOutTime !== null ? leadOutTime : null;
            const progress = ((currentTime - block.outTime) / trueLeadOutTime);
            block.phase = BLOCK_PHASE_IN;
            block.inTime = currentTime;
            block.outTime = null;
            block.blockPercent = -1;
            block.blockPercentOffset = 1 - progress;
          }
          // Block has default "jump" switch mode
          else {
            block.phase = BLOCK_PHASE_IN;
            block.inTime = currentTime;
            block.outTime = null;
            block.blockPercent = -1;
            block.blockPercentOffset = null;
          }
        }
        // Not running a phase out
        else {
          // Prevent double activation
          if (block.phase !== BLOCK_PHASE_IN && block.phase !== BLOCK_PHASE_RUN) {
            block.phase = BLOCK_PHASE_IN;
            block.inTime = currentTime;
            block.outTime = null;
            block.blockPercent = -1;
            block.blockPercentOffset = null;
          }
        }
      }
      // Block deactivated by user
      else {
        // Block was running a phase in
        if (block.phase === BLOCK_PHASE_IN) {
          // Block has "mirror" switch mode
          if (block.switchMode === ITEM_SWITCH_MODE_MIRROR) {
            // Compute the offset
            const trueLeadInTime = typeof leadInTime !== 'undefined' && leadInTime !== null ? leadInTime : null;
            const progress = ((currentTime - block.inTime) / trueLeadInTime);
            block.phase = BLOCK_PHASE_OUT;
            block.inTime = null;
            block.outTime = currentTime;
            block.blockPercent = 1;
            block.blockPercentOffset = 1 - progress;
          }
          // Block has default "jump" switch mode
          else {
            block.phase = BLOCK_PHASE_OUT;
            block.inTime = null;
            block.outTime = currentTime;
            block.blockPercent = 1;
            block.blockPercentOffset = null;
          }
        }
        // Not running a phase out
        else {
          // Prevent double de-activation
          if (block.phase !== BLOCK_PHASE_OUT && block.phase !== null) {
            block.phase = BLOCK_PHASE_OUT;
            block.inTime = null;
            block.outTime = currentTime;
            block.blockPercent = 1;
            block.blockPercentOffset = null;
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
      const { inTime, outTime, leadInTime, leadOutTime, blockPercentOffset } = block;
      const trueLeadInTime = typeof leadInTime !== 'undefined' && leadInTime !== null ? leadInTime : null;
      const trueLeadOutTime = typeof leadOutTime !== 'undefined' && leadOutTime !== null ? leadOutTime : null;

      let blockPercent = null;

      if (block.phase === BLOCK_PHASE_IN) {
        const leadIn = trueLeadInTime !== null && inTime !== null
          ? ((currentTime - inTime) / trueLeadInTime) : null;
        if (leadIn !== null && leadIn < 1) {
          const offset = blockPercentOffset ?? 0;
          blockPercent = (offset + (leadIn * (1 - offset))) - 1;
        } else {
          block.phase = BLOCK_PHASE_RUN;
        }
      }

      if (block.phase === BLOCK_PHASE_RUN) {
        blockPercent = 1
      }

      if (block.phase === BLOCK_PHASE_OUT) {
        const leadOut = trueLeadOutTime !== null && outTime !== null ?
          ((currentTime - outTime) / trueLeadOutTime) :
          null;
        if (leadOut !== null && leadOut < 1) {
          const offset = blockPercentOffset ?? 0;
          blockPercent = (offset + (leadOut * (1 - offset))) + 1;
        } else {
          block.phase = null;
          block.inTime = null;
          block.outTime = null;
          block.blockPercent = null;
          block.blockPercentOffset = null;
        }
      }

      if (block.phase !== null) {
        block.blockPercent = blockPercent;

        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent,
        };

        block.instance.render(currentTime, blockInfo);
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
        if (type === 'midi') {
          if (block.trigger === ITEM_TRIGGER_MIDI_CC) {
            if (data[1] === parseInt(block.triggerSource)) {
              const on = data[2] === 127;
              console.log(data[1], data[2], on); //@TODO cleanup
              if (on) {
                updatedActiveItems[block.id] = true;
              } else {
                delete updatedActiveItems[block.id];
              }
              change = true
            }
          }
          // @TODO midi_note
        } else if (type === 'osc') {
          if (block.trigger === ITEM_TRIGGER_OSC_ADR_ARG) {
            if (data.address === block.triggerSource) {
              const on = data.args && data.args.length > 0 ? !!data.args[0].value : false;
              console.log(data.address, data.args, on); //@TODO cleanup
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
      itemsMap[0].filter((id) => this._blocks[id].phase !== null),
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
      this._board.removeAllListeners('updated');
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
