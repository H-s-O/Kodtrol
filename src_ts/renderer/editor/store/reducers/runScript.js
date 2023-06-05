import { RUN_SCRIPT, STOP_SCRIPT } from '../actions/scripts';

const defaultState = null;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case RUN_SCRIPT:
      return payload;
      break;

    case STOP_SCRIPT:
      return null;
      break;

    default:
      return state;
      break;
  }
}
