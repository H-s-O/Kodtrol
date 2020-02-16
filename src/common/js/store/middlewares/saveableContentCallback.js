import { SAVE_DEVICE } from '../actions/devices';
import { SAVE_SCRIPT } from '../actions/scripts';
import { SAVE_TIMELINE } from '../actions/timelines';
import { SAVE_MEDIA } from '../actions/medias';
import { SAVE_BOARD } from '../actions/boards';
import { SAVE_INPUTS } from '../actions/inputs';
import { SAVE_OUTPUTS } from '../actions/outputs';

export default (callback) => {
  return store => next => action => {
    const result = next(action);
    if (
      action.type === SAVE_DEVICE
      || action.type === SAVE_SCRIPT
      || action.type === SAVE_MEDIA
      || action.type === SAVE_TIMELINE
      || action.type === SAVE_BOARD
      || action.type === SAVE_INPUTS
      || action.type === SAVE_OUTPUTS
    ) {
      callback(action.type);
    }
    return result;
  };
};
