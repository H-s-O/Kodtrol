import { EDIT_SCRIPT, FOCUS_EDITED_SCRIPT, CLOSE_SCRIPT } from '../actions/scripts';
import { UPDATE_EDITED_TIMELINE, EDIT_TIMELINE, FOCUS_EDITED_TIMELINE, CLOSE_TIMELINE } from '../actions/timelines';
import { UPDATE_EDITED_BOARD, EDIT_BOARD, FOCUS_EDITED_BOARD, CLOSE_BOARD } from '../actions/boards';

export default (state, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
    case FOCUS_EDITED_SCRIPT:
      {
        const scriptId = typeof payload === 'object' ? payload.id : payload;
        return {
          ...state,
          editScripts: state.editScripts.map((script) => ({
            ...script,
            active: script.id === scriptId,
          })),
        }
      }
      break;
    case CLOSE_SCRIPT:
      {
        const scriptId = typeof payload === 'object' ? payload.id : payload;
        const currentActive = state.editScripts.find(({ active }) => active);
        return {
          ...state,
          editScripts: state.editScripts.map((script, index) => ({
            ...script,
            active: currentActive && scriptId !== currentActive.id ? script.id === currentActive.id : index === 0,
          })),
        }
      }
      break;

    // case EDIT_TIMELINE:
    // case FOCUS_EDITED_TIMELINE:
    // case UPDATE_EDITED_TIMELINE:
    // case CLOSE_TIMELINE:
    //   {
    //     const editedTimeline = state.editTimelines.find(({ active }) => active);
    //     return {
    //       ...state,
    //       lastEditor: editedTimeline ? {
    //         type: 'timeline',
    //         id: editedTimeline.id,
    //       } : null,
    //     };
    //   }
    //   break;

    // case EDIT_BOARD:
    // case FOCUS_EDITED_BOARD:
    // case UPDATE_EDITED_BOARD:
    // case CLOSE_BOARD:
    //   {
    //     const editedBoard = state.editBoards.find(({ active }) => active);
    //     return {
    //       ...state,
    //       lastEditor: editedBoard ? {
    //         type: 'board',
    //         id: editedBoard.id,
    //       } : null,
    //     };
    //   }
    //   break;

    default:
      return state;
      break;
  }
};
