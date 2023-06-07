import { AnyAction } from 'redux';

import { RunScriptState } from '../../../../common/types';
import { RUN_SCRIPT, STOP_SCRIPT } from '../actions/scripts';

export default (state: RunScriptState = null, { type, payload }: AnyAction): RunScriptState => {
  switch (type) {
    case RUN_SCRIPT:
      return payload;
      break;

    case STOP_SCRIPT:
      return null;
      break;

    default:
      return state;
      break;
  }
}
