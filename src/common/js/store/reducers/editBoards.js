import { EDIT_BOARD, CLOSE_BOARD } from "../actions/boards";

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_BOARD:
      return [...state, payload];
      break;

    case CLOSE_BOARD:
      return state.filter((id) => id !== payload);
      break;

    default:
      return state;
      break;
  }
};
