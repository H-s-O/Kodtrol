import { AnyAction } from 'redux';
import { UPDATE_IO_LIST } from '../actions/ioAvailable';

type IOAvailableState = object[];

export default (state: IOAvailableState = [], { type, payload }: AnyAction) => {
  switch (type) {
    case UPDATE_IO_LIST:
      return payload;
      break;

    default:
      return state;
      break;
  }
};
