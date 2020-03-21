import {
  UPDATE_TIMELINES,
  CREATE_TIMELINE,
  DELETE_TIMELINE,
  SAVE_TIMELINE,
  CREATE_TIMELINES,
} from '../actions/timelines';

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_TIMELINES:
      return payload;
      break;

    case CREATE_TIMELINE:
      return [...state, payload];
      break;

    case CREATE_TIMELINES:
      return [...state, ...payload];
      break;

    case DELETE_TIMELINE:
      return state.filter(it => it.id !== payload);
      break;

    case SAVE_TIMELINE:
      return state.map(it => it.id === payload.id ? { ...it, ...payload.data } : it);
      break;

    default:
      return state;
      break;
  }
};
