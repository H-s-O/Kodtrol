import { hashDataObject } from '../../../lib/hash';
import { SAVE_EDITED_SCRIPT } from '../../actions/scripts';
import { SAVE_EDITED_TIMELINE } from '../../actions/timelines';
import { SAVE_EDITED_BOARD } from '../../actions/boards';

export default (state, { type, payload }) => {
  switch (type) {
    case SAVE_EDITED_SCRIPT: {
      const { content } = state.editScripts.find(({ id }) => id === payload);
      return {
        ...state,
        editScripts: state.editScripts.map((script) => script.id === payload ? { ...script, changed: false } : script),
        scripts: state.scripts.map((script) => {
          if (script.id === payload) {
            const newData = { ...script, content };
            const hash = hashDataObject(newData, ['id', 'name']);
            return {
              ...newData,
              hash,
            };
          }
          return script;
        }),
      };
    }
      break;

    case SAVE_EDITED_TIMELINE: {
      const { layers, items, zoom, zoomVert, recording, recordedTriggers } = state.editTimelines.find(({ id }) => id === payload);
      return {
        ...state,
        editTimelines: state.editTimelines.map((timeline) => timeline.id === payload ? { ...timeline, changed: false } : timeline),
        timelines: state.timelines.map((timeline) => {
          if (timeline.id === payload) {
            const newData = { ...timeline, layers, items, zoom, zoomVert, recording, recordedTriggers };
            const hash = hashDataObject(newData, ['id:1', 'name', 'zoom', 'zoomVert', 'recording', 'recordedTriggers']);
            return {
              ...newData,
              hash,
            };
          }
          return timeline;
        }),
      };
    }
      break;

    case SAVE_EDITED_BOARD: {
      const { layers, items, zoom, zoomVert } = state.editBoards.find(({ id }) => id === payload);
      return {
        ...state,
        editBoards: state.editBoards.map((board) => board.id === payload ? { ...board, changed: false } : board),
        boards: state.boards.map((board) => {
          if (board.id === payload) {
            const newData = { ...board, layers, items, zoom, zoomVert };
            const hash = hashDataObject(newData, ['id:1', 'name', 'zoom', 'zoomVert']);
            return {
              ...newData,
              hash,
            };
          }
          return board;
        }),
      };
    }
      break;

    default:
      return state;
      break;
  }
}
