import {
  UPDATE_DEVICES,
  CREATE_DEVICE,
  DELETE_DEVICE,
  SAVE_DEVICE,
  CREATE_DEVICES,
} from '../actions/devices';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DEVICES:
      return payload;
      break;

    case CREATE_DEVICE:
      return [...state, payload];
      break;

    case CREATE_DEVICES:
      return [...state, ...payload];
      break;

    case DELETE_DEVICE:
      return state.filter(it => it.id !== payload);
      break;

    case SAVE_DEVICE:
      return state.map(it => it.id === payload.id ? { ...it, ...payload.data } : it);
      break;

    default:
      return state;
      break;
  }
}
