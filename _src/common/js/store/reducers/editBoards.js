import { EDIT_BOARD, CLOSE_BOARD, UPDATE_EDITED_BOARD } from '../actions/boards';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_BOARD:
      return [...state, payload];
      break;

    case UPDATE_EDITED_BOARD:
      return state.map((board) => board.id === payload.id ? { ...board, ...payload.data, changed: true } : board)
      break;

    case CLOSE_BOARD:
      return state.filter(({ id }) => id !== payload);
      break;

    default:
      return state;
      break;
  }
};
