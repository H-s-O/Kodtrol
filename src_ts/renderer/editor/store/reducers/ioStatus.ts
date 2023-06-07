import { AnyAction } from 'redux';

import { UPDATE_IO_STATUS } from '../actions/ioStatus';
import { IOStatusState } from '../../../../common/types';

export default (state: IOStatusState = {}, { type, payload }: AnyAction): IOStatusState => {
  switch (type) {
    case UPDATE_IO_STATUS:
      return {
        ...state,
        ...payload,
      };
      break;

    default:
      return state;
      break;
  }
};
