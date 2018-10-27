import { updateTimelineInfoUser } from '../actions/timelineInfo';

export default () => {
  return store => next => action => {
    if (
      action.type === 'RUN_TIMELINE'
      && action.payload === null
    ) {
      store.dispatch(updateTimelineInfoUser({
        playing: false,
        position: 0,
      }));
    }
    return next(action);
  };
};
