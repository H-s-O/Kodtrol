import { SAVE_DEVICE, CREATE_DEVICE, CREATE_DEVICES } from '../../common/js/store/actions/devices';
import { SAVE_SCRIPT, SAVE_EDITED_SCRIPT, CREATE_SCRIPT, CREATE_SCRIPTS } from '../../common/js/store/actions/scripts';
import { SAVE_TIMELINE, SAVE_EDITED_TIMELINE, CREATE_TIMELINE, CREATE_TIMELINES } from '../../common/js/store/actions/timelines';
import { SAVE_MEDIA, CREATE_MEDIA, CREATE_MEDIAS } from '../../common/js/store/actions/medias';
import { SAVE_BOARD, SAVE_EDITED_BOARD, CREATE_BOARD, CREATE_BOARDS } from '../../common/js/store/actions/boards';
import { SAVE_INPUTS } from '../../common/js/store/actions/inputs';
import { SAVE_OUTPUTS } from '../../common/js/store/actions/outputs';

const SAVEABLE_ACTIONS = [
  CREATE_DEVICE,
  CREATE_DEVICES,
  SAVE_DEVICE,
  CREATE_SCRIPT,
  CREATE_SCRIPTS,
  SAVE_SCRIPT,
  SAVE_EDITED_SCRIPT,
  CREATE_MEDIA,
  CREATE_MEDIAS,
  SAVE_MEDIA,
  CREATE_TIMELINE,
  CREATE_TIMELINES,
  SAVE_TIMELINE,
  SAVE_EDITED_TIMELINE,
  CREATE_BOARD,
  CREATE_BOARDS,
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
