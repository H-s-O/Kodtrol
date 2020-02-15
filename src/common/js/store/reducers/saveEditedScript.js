import { SAVE_EDITED_SCRIPT } from '../actions/scripts';
import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export default (state, { type, payload }) => {
  switch (type) {
    case SAVE_EDITED_SCRIPT: {
      const { content } = state.editScripts.find(({ id }) => id === payload);
      return {
        ...state,
        editScripts: state.editScripts.map((script) => script.id === payload ? { ...script, changed: false } : script),
        scripts: state.scripts.map((script) => {
          if (script.id === payload) {
            const newData = { ...script, content };
            const hash = hashDataObject(newData, excludeHashProps);
            return {
              ...newData,
              hash,
            };
          }
          return script;
        }),
      };
    }
      break;

    default:
      return state;
      break;
  }
}
