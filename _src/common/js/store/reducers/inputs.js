import { UPDATE_INPUTS, SAVE_INPUTS } from '../actions/inputs';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_INPUTS:
      return payload;
      break;

    case SAVE_INPUTS:
      return payload;
      break;

    default:
      return state;
      break;
  }
}
