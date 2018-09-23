import { updateTimelineInfoUser } from '../actions/timelineInfo';

export default () => {
  return store => next => action => {
    if (
      action.type === 'UPDATE_TIMELINE_INFO'
      && action.payload !== null
      && store.getState().timelineInfoUser !== null
    ) {
      store.dispatch(updateTimelineInfoUser(null));
    }
    return next(action);
  };
};
