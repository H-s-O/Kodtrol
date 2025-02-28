import { DELETE_SCRIPT } from '../../actions/scripts';
import { DELETE_TIMELINE } from '../../actions/timelines';
import { DELETE_BOARD } from '../../actions/boards';

export default (state, { type, payload }) => {
  switch (type) {
    case DELETE_SCRIPT:
      return {
        ...state,
        editScripts: state.editScripts.filter(({ id }) => id !== payload),
      }
      break;

    case DELETE_TIMELINE:
      return {
        ...state,
        editTimelines: state.editTimelines.filter(({ id }) => id !== payload),
      }
      break;

    case DELETE_BOARD:
      return {
        ...state,
        editBoards: state.editBoards.filter(({ id }) => id !== payload),
      }
      break;

    default:
      return state;
      break;
  }
}
