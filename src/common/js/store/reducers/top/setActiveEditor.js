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
        const payloadId = typeof payload === 'object' ? payload.id : payload;
        const currentActive = state.editTimelines.find(({ active }) => active);
        return {
          ...state,
          editTimelines: state.editTimelines.map((timeline) => ({
            ...timeline,
            active: currentActive && payloadId !== currentActive.id ? timeline.id === currentActive.id : false,
          })),
          ...(!currentActive ? {
            editBoards: state.editBoards.map((board, index) => index === 0 ? { ...board, active: true } : board),
          } : undefined)
        }
      }
      break;
    case CLOSE_BOARD:
      {
        const payloadId = typeof payload === 'object' ? payload.id : payload;
        const currentActive = state.editBoards.find(({ active }) => active);
        return {
          ...state,
          editBoards: state.editBoards.map((board) => ({
            ...board,
            active: currentActive && payloadId !== currentActive.id ? board.id === currentActive.id : false,
          })),
          ...(!currentActive ? {
            editTimelines: state.editTimelines.map((timeline, index) => index === 0 ? { ...timeline, active: true } : timeline),
          } : undefined)
        }
      }
      break;

    default:
      return state;
      break;
  }
};
