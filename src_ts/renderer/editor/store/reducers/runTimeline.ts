import { AnyAction } from 'redux';

import { RunTimelineState } from '../../../../common/types';
import { RUN_TIMELINE, STOP_TIMELINE } from '../actions/timelines';

export default (state: RunTimelineState = null, { type, payload }: AnyAction): RunTimelineState => {
  switch (type) {
    case RUN_TIMELINE:
      return payload;
      break;

    case STOP_TIMELINE:
      return null;
      break;

    default:
      return state;
      break;
  }
}
