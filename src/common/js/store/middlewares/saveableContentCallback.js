import { stopTimeline } from '../actions/timelines';
import { stopPreviewScript } from '../actions/scripts';

export default (callback) => {
  return store => next => action => {
    const result = next(action);
    if (
      action.type === 'SAVE_DEVICE'
      || action.type === 'SAVE_SCRIPT'
      || action.type === 'SAVE_TIMELINE'
      || action.type === 'SAVE_BOARD'
      || action.type === 'SAVE_INPUT'
      || action.type === 'SAVE_OUTPUT'
      || action.type === 'SAVE_INPUTS'
      || action.type === 'SAVE_OUTPUTS'
      || action.type === 'SAVE_MEDIA'
    ) {
      callback(action.type);
    }
    return result;
  };
};
