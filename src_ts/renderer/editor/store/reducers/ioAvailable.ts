import { AnyAction } from 'redux';

import { UPDATE_IO_LIST } from '../actions/ioAvailable';
import { IOAvailableState } from '../../../../common/types';

export default (state: IOAvailableState = [], { type, payload }: AnyAction): IOAvailableState => {
  switch (type) {
    case UPDATE_IO_LIST:
      return payload;
      break;

    default:
      return state;
      break;
  }
};
