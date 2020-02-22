import { EDIT_SCRIPT, CLOSE_SCRIPT, UPDATE_EDITED_SCRIPT, SAVE_EDITED_SCRIPT, FOCUS_EDITED_SCRIPT } from '../actions/scripts';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
      return [...state.map((script) => ({ ...script, active: false })), payload];
      break;

    case FOCUS_EDITED_SCRIPT:
      return state.map((script) => ({ ...script, active: script.id === payload }));
      break;

    case UPDATE_EDITED_SCRIPT:
      return state.map((script) => script.id === payload.id ? { ...script, ...payload.data, changed: true } : script)
      break;

    case SAVE_EDITED_SCRIPT:
      return state.map((script) => script.id === payload ? { ...script, changed: false } : script)
      break;

    case CLOSE_SCRIPT:
      return state.filter(({ id }) => id !== payload).map((script, index) => ({ ...script, active: index === 0 }));
      break;

    default:
      return state;
      break;
  }
}
