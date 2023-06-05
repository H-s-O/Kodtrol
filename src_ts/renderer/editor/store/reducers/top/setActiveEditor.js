import { EDIT_SCRIPT, FOCUS_EDITED_SCRIPT, CLOSE_SCRIPT } from '../../actions/scripts';
import { EDIT_TIMELINE, FOCUS_EDITED_TIMELINE, CLOSE_TIMELINE } from '../../actions/timelines';
import { EDIT_BOARD, FOCUS_EDITED_BOARD, CLOSE_BOARD } from '../../actions/boards';

export default (state, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
    case FOCUS_EDITED_SCRIPT:
      {
        const payloadId = typeof payload === 'object' ? payload.id : payload;
        return {
          ...state,
          editScripts: state.editScripts.map((script) => ({
            ...script,
            active: script.id === payloadId,
          })),
        };
      }
      break;
    case CLOSE_SCRIPT:
      {
        const payloadId = typeof payload === 'object' ? payload.id : payload;
        const currentActive = state.editScripts.find(({ active }) => active);
        return {
          ...state,
          editScripts: state.editScripts.map((script, index) => ({
            ...script,
            active: currentActive && payloadId !== currentActive.id ? script.id === currentActive.id : index === 0,
          })),
        };
      }
      break;

    case EDIT_TIMELINE:
    case FOCUS_EDITED_TIMELINE:
    case EDIT_BOARD:
    case FOCUS_EDITED_BOARD:
      {
        const payloadId = typeof payload === 'object' ? payload.id : payload;
        return {
          ...state,
          editTimelines: state.editTimelines.map((timeline) => ({
            ...timeline,
            active: timeline.id === payloadId,
          })),
          editBoards: state.editBoards.map((board) => ({
            ...board,
            active: board.id === payloadId,
          })),
        };
      }
      break;

    case CLOSE_TIMELINE:
      {
        // If currently active is a board, do nothing
        if (state.editBoards.find(({ active }) => active)) {
          return state;
        }
        // If there's no edit timelines, switch to first board if existing
        else if (state.editTimelines.length === 0) {
          return {
            ...state,
            editBoards: state.editBoards.map((board, index) => ({
              ...board,
              active: index === 0,
            })),
          };
        }
        // Switch to first timeline if there's no more active timeline
        else if (!state.editTimelines.find(({ active }) => active)) {
          return {
            ...state,
            editTimelines: state.editTimelines.map((timeline, index) => ({
              ...timeline,
              active: index === 0,
            })),
          };
        }
        return state;
      }
      break;

    case CLOSE_BOARD:
      {
        // If currently active is timeline, do nothing
        if (state.editTimelines.find(({ active }) => active)) {
          return state;
        }
        // If there's no edit boards, switch to last timeline if existing
        else if (state.editBoards.length === 0) {
          return {
            ...state,
            editTimelines: state.editTimelines.map((timeline, index) => ({
              ...timeline,
              active: index === state.editTimelines.length - 1,
            })),
          };
        }
        // Switch to first board if there's no more active board
        else if (!state.editBoards.find(({ active }) => active)) {
          return {
            ...state,
            editBoards: state.editBoards.map((board, index) => ({
              ...board,
              active: index === 0,
            })),
          };
        }
        return state;
      }
      break;

    default:
      return state;
      break;
  }
};
