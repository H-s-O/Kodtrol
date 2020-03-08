import { SAVE_DEVICE, CREATE_DEVICE } from '../actions/devices';
import { SAVE_SCRIPT, SAVE_EDITED_SCRIPT, CREATE_SCRIPT } from '../actions/scripts';
import { SAVE_TIMELINE, SAVE_EDITED_TIMELINE, CREATE_TIMELINE } from '../actions/timelines';
import { SAVE_MEDIA, CREATE_MEDIA } from '../actions/medias';
import { SAVE_BOARD, SAVE_EDITED_BOARD, CREATE_BOARD } from '../actions/boards';
import { SAVE_INPUTS } from '../actions/inputs';
import { SAVE_OUTPUTS } from '../actions/outputs';

const SAVEABLE_ACTIONS = [
  CREATE_DEVICE,
  SAVE_DEVICE,
  CREATE_SCRIPT,
  SAVE_SCRIPT,
  SAVE_EDITED_SCRIPT,
  CREATE_MEDIA,
  SAVE_MEDIA,
  CREATE_TIMELINE,
  SAVE_TIMELINE,
  SAVE_EDITED_TIMELINE,
  CREATE_BOARD,
  SAVE_BOARD,
  SAVE_EDITED_BOARD,
  SAVE_INPUTS,
  SAVE_OUTPUTS,
];

export default (callback) => {
  return store => next => action => {
    const result = next(action);
    if (SAVEABLE_ACTIONS.includes(action.type)) {
      callback(action.type);
    }
    return result;
  };
};
