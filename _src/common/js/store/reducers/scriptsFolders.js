import { CREATE_SCRIPT_FOLDER, DELETE_SCRIPT_FOLDER } from '../actions/scripts';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case CREATE_SCRIPT_FOLDER:
      return [...state, payload];
      break;

    case DELETE_SCRIPT_FOLDER:
      return state.filter(it => it.id !== payload);
      break;

    default:
      return state;
      break;
  }
}
