import { RUN_TIMELINE, STOP_TIMELINE } from '../actions/timelines';

const defaultState = null;

export default (state = defaultState, { type, payload }) => {
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
