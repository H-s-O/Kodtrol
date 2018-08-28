import { stopTimeline } from '../actions/timelines';
import { stopPreviewScript } from '../actions/scripts';

export default store => next => action => {
  if (
    action.type === 'PREVIEW_SCRIPT'
    && action.payload !== null
    && store.getState().runTimeline !== null
  ) {
    store.dispatch(stopTimeline());
  } else if (
    action.type === 'RUN_TIMELINE'
    && action.payload !== null
    && store.getState().previewScript !== null
  ) {
    store.dispatch(stopPreviewScript());
  }
  return next(action);
};
