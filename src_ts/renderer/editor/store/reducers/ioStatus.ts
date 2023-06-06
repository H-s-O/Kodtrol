import { AnyAction } from 'redux';

import { UPDATE_IO_STATUS } from '../actions/ioStatus';
import { IOStatus } from '../../../../common/constants';

type IOStatusState = {
  [key: string]: IOStatus
};

export default (state: IOStatusState = {}, { type, payload }: AnyAction) => {
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
