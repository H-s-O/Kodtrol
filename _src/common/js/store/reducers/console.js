import { SET_CONSOLE_OPENED, SET_CONSOLE_CLOSED, TOGGLE_CONSOLE } from '../actions/console';

const defaultState = false;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SET_CONSOLE_OPENED:
      return true;
      break;

    case SET_CONSOLE_CLOSED:
      return false;
      break;

    case TOGGLE_CONSOLE:
      return !state;
      break;

    default:
      return state;
      break;
  }
}
