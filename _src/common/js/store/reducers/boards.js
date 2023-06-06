import {
  UPDATE_BOARDS,
  CREATE_BOARD,
  DELETE_BOARD,
  SAVE_BOARD,
  CREATE_BOARDS,
} from '../actions/boards';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_BOARDS:
      return payload;
      break;

    case CREATE_BOARD:
      return [...state, payload];
      break;

    case CREATE_BOARDS:
      return [...state, ...payload];
      break;

    case DELETE_BOARD:
      return state.filter(it => it.id !== payload);
      break;

    case SAVE_BOARD:
      return state.map(it => it.id === payload.id ? { ...it, ...payload.data } : it);
      break;

    default:
      return state;
      break;
  }
};
