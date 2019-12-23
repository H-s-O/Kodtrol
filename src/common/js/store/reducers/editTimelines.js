import { EDIT_TIMELINE, CLOSE_TIMELINE } from "../actions/timelines";

const defaultState = [];

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case EDIT_TIMELINE:
      return [...state, payload];
      break;

    case CLOSE_TIMELINE:
      return state.filter((id) => id !== payload);
      break;

    default:
      return state;
      break;
  }
};
