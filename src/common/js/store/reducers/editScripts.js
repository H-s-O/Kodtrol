import { EDIT_SCRIPT, CLOSE_SCRIPT } from '../actions/scripts';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
      return [...state, payload];
      break;

    case CLOSE_SCRIPT:
      return state.filter((id) => id !== payload);
      break;

    default:
      return state;
      break;
  }
}
