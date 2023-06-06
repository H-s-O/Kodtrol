import { AnyAction } from 'redux';

import { EditTimelinesState } from '../../../../common/types';
import { EDIT_TIMELINE, CLOSE_TIMELINE, UPDATE_EDITED_TIMELINE } from '../actions/timelines';

export default (state: EditTimelinesState = [], { type, payload }: AnyAction): EditTimelinesState => {
  switch (type) {
    case EDIT_TIMELINE:
      return [...state, payload];
      break;

    case UPDATE_EDITED_TIMELINE:
      return state.map((timeline) => timeline.id === payload.id ? { ...timeline, ...payload.data, changed: true } : timeline)
      break;

    case CLOSE_TIMELINE:
      return state.filter(({ id }) => id !== payload);
      break;

    default:
      return state;
      break;
  }
};
