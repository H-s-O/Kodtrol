import { AnyAction } from 'redux';

import { RunBoardState } from '../../../../common/types';
import { RUN_BOARD, STOP_BOARD } from '../actions/boards';

export default (state: RunBoardState = null, { type, payload }: AnyAction): RunBoardState => {
  switch (type) {
    case RUN_BOARD:
      return payload;
      break;

    case STOP_BOARD:
      return null;
      break;

    default:
      return state;
      break;
  }
}
