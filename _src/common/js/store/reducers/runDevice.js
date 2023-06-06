import { RUN_DEVICE, STOP_DEVICE } from '../actions/devices';

const defaultState = null;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case RUN_DEVICE:
      return payload;
      break;

    case STOP_DEVICE:
      return null;
      break;

    default:
      return state;
      break;
  }
}
