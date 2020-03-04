import { EDIT_SCRIPT, CLOSE_SCRIPT, UPDATE_EDITED_SCRIPT } from '../actions/scripts';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
      return [...state, payload];
      break;

    case UPDATE_EDITED_SCRIPT:
      return state.map((script) => script.id === payload.id ? { ...script, ...payload.data, changed: true } : script)
      break;

    case CLOSE_SCRIPT:
      return state.filter(({ id }) => id !== payload);
      break;

    default:
      return state;
      break;
  }
}
