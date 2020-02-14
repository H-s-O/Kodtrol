import { UPDATE_OUTPUTS, SAVE_OUTPUTS } from '../actions/outputs';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_OUTPUTS:
      return payload;
      break;

    case SAVE_OUTPUTS:
      return payload;
      break;

    default:
      return state;
      break;
  }
}
