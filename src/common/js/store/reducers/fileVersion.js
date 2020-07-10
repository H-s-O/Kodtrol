import appVersion from '../../lib/appVersion'

const defaultState = appVersion;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    default:
      return state;
      break;
  }
};
