import { EDIT_BOARD, CLOSE_BOARD, UPDATE_EDITED_BOARD, SAVE_EDITED_BOARD, FOCUS_EDITED_BOARD } from '../actions/boards';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_BOARD:
      return [...state, payload];
      break;

    case FOCUS_EDITED_BOARD:
      return state.map((board) => ({ ...board, active: board.id === payload }));
      break;

    case UPDATE_EDITED_BOARD:
      return state.map((board) => board.id === payload.id ? { ...board, ...payload, changed: true } : board)
      break;

    case SAVE_EDITED_BOARD:
      return state.map((board) => board.id === payload ? { ...board, changed: false } : board)
      break;

    case CLOSE_BOARD:
      return state.filter(({ id }) => id !== payload).map((board, index) => ({ ...board, active: index === 0 }));
      break;

    default:
      return state;
      break;
  }
};
