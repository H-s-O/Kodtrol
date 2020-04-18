import { UPDATE_IO_LIST } from '../actions/ioAvailable';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_IO_LIST:
      return payload;
      break;

    default:
      return state;
      break;
  }
};
