import { UPDATE_EDITED_SCRIPT, EDIT_SCRIPT, FOCUS_EDITED_SCRIPT, CLOSE_SCRIPT } from '../../actions/scripts';
import { UPDATE_EDITED_TIMELINE, EDIT_TIMELINE, FOCUS_EDITED_TIMELINE, CLOSE_TIMELINE } from '../../actions/timelines';
import { UPDATE_EDITED_BOARD, EDIT_BOARD, FOCUS_EDITED_BOARD, CLOSE_BOARD } from '../../actions/boards';

export default (state, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
    case FOCUS_EDITED_SCRIPT:
    case UPDATE_EDITED_SCRIPT:
    case CLOSE_SCRIPT:
      {
        const editedScript = state.editScripts.find(({ active }) => active);
        return {
          ...state,
          lastEditor: editedScript ? {
            type: 'script',
            id: editedScript.id,
          } : null,
        };
      }
      break;

    case EDIT_TIMELINE:
    case FOCUS_EDITED_TIMELINE:
    case UPDATE_EDITED_TIMELINE:
    case CLOSE_TIMELINE:
    case EDIT_BOARD:
    case FOCUS_EDITED_BOARD:
    case UPDATE_EDITED_BOARD:
    case CLOSE_BOARD:
      {
        const editedTimeline = state.editTimelines.find(({ active }) => active);
        const editedBoard = state.editBoards.find(({ active }) => active);
        return {
          ...state,
          lastEditor: editedTimeline ? {
            type: 'timeline',
            id: editedTimeline.id,
          } : editedBoard ? {
            type: 'board',
            id: editedBoard.id,
          } : null,
        };
      }
      break;

    default:
      return state;
      break;
  }
};
