import { SAVE_EDITED_SCRIPT } from '../actions/scripts';

export default (state, { type, payload }) => {
  switch (type) {
    case SAVE_EDITED_SCRIPT: {
      const { content } = state.editScripts.find(({ id }) => id === payload);
      return {
        ...state,
        editScripts: state.editScripts.map((script) => script.id === payload ? { ...script, changed: false } : script),
        scripts: state.scripts.map((script) => script.id === payload ? { ...script, content } : script),
      };
    }
      break;

    default:
      return state;
      break;
  }
}
