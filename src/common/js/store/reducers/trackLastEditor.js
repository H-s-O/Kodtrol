import { UPDATE_EDITED_SCRIPT, EDIT_SCRIPT, FOCUS_EDITED_SCRIPT, CLOSE_SCRIPT } from '../actions/scripts';

export default (state, { type, payload }) => {
  switch (type) {
    case EDIT_SCRIPT:
    case FOCUS_EDITED_SCRIPT:
    case UPDATE_EDITED_SCRIPT:
    case CLOSE_SCRIPT: {
      const editedScript = state.editScripts.find(({ active }) => active);
      return {
        ...state,
        lastEditor: editedScript ? {
          type: 'script',
          id: editedScript.id,
        } : null,
      };
    }
      break;

    default:
      return state;
      break;
  }
};
