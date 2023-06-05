import { RUN_BOARD, STOP_BOARD } from '../actions/boards';

const defaultState = null;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case RUN_BOARD:
      return payload;
      break;

    case STOP_BOARD:
      return null;
      break;

    default:
      return state;
      break;
  }
}
