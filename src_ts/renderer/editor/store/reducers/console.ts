import { AnyAction } from 'redux';

import {
  SET_CONSOLE_OPENED,
  SET_CONSOLE_CLOSED,
  TOGGLE_CONSOLE,
} from '../actions/console';
import { ConsoleState } from '../../../../common/types';

export default (state: ConsoleState = false, { type, payload }: AnyAction): ConsoleState => {
  switch (type) {
    case SET_CONSOLE_OPENED:
      return true;
      break;

    case SET_CONSOLE_CLOSED:
      return false;
      break;

    case TOGGLE_CONSOLE:
      return !state;
      break;

    default:
      return state;
      break;
  }
}
