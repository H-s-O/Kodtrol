import { AnyAction } from 'redux';

import { InputsState } from '../../../../common/types';
import { UPDATE_INPUTS, SAVE_INPUTS } from '../actions/inputs';

export default (state: InputsState = [], { type, payload }: AnyAction): InputsState => {
  switch (type) {
    case UPDATE_INPUTS:
      return payload;
      break;

    case SAVE_INPUTS:
      return payload;
      break;

    default:
      return state;
      break;
  }
}
