import { AnyAction } from 'redux';

import { OutputsState } from '../../../../common/types';
import { UPDATE_OUTPUTS, SAVE_OUTPUTS } from '../actions/outputs';

export default (state: OutputsState = [], { type, payload }: AnyAction): OutputsState => {
  switch (type) {
    case UPDATE_OUTPUTS:
      return payload;
      break;

    case SAVE_OUTPUTS:
      return payload;
      break;

    default:
      return state;
      break;
  }
}
