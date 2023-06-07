import { AnyAction } from 'redux';

import { RunDeviceState } from '../../../../common/types';
import { RUN_DEVICE, STOP_DEVICE } from '../actions/devices';

export default (state: RunDeviceState = null, { type, payload }: AnyAction): RunDeviceState => {
  switch (type) {
    case RUN_DEVICE:
      return payload;
      break;

    case STOP_DEVICE:
      return null;
      break;

    default:
      return state;
      break;
  }
}
