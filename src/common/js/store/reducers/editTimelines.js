import { EDIT_TIMELINE, CLOSE_TIMELINE, UPDATE_EDITED_TIMELINE, SAVE_EDITED_TIMELINE, FOCUS_EDITED_TIMELINE } from '../actions/timelines';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_TIMELINE:
      return [...state, payload];
      break;

    case FOCUS_EDITED_TIMELINE:
      return state.map((timeline) => ({ ...timeline, active: timeline.id === payload }));
      break;

    case UPDATE_EDITED_TIMELINE:
      return state.map((timeline) => timeline.id === payload.id ? { ...timeline, ...payload.data, changed: true } : timeline)
      break;

    case SAVE_EDITED_TIMELINE:
      return state.map((timeline) => timeline.id === payload ? { ...timeline, changed: false } : timeline)
      break;

    case CLOSE_TIMELINE:
      return state.filter(({ id }) => id !== payload).map((timeline, index) => ({ ...timeline, active: index === 0 }));
      break;

    default:
      return state;
      break;
  }
};
