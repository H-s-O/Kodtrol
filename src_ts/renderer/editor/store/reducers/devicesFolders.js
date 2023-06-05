import { CREATE_DEVICE_FOLDER, DELETE_DEVICE_FOLDER } from '../actions/devices';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case CREATE_DEVICE_FOLDER:
      return [...state, payload];
      break;

    case DELETE_DEVICE_FOLDER:
      return state.filter(it => it.id !== payload);
      break;

    default:
      return state;
      break;
  }
}
