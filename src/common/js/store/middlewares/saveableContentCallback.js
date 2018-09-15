import { stopTimeline } from '../actions/timelines';
import { stopPreviewScript } from '../actions/scripts';

export default (callback) => {
  return store => next => action => {
    const result = next(action);
    if (
      action.type === 'SAVE_SCRIPT'
      || action.type === 'SAVE_TIMELINE'
    ) {
      callback(action.type);
    }
    return result;
  };
};
