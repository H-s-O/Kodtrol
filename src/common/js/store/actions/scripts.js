import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';
import { SCRIPT_TEMPLATE } from '../../constants/app';

const excludeHashProps = [
  'id',
  'name',
];

export const UPDATE_SCRIPTS = 'update_scripts';
export const updateScriptsAction = (scripts) => {
  return {
    type: UPDATE_SCRIPTS,
    payload: scripts,
  };
};

export const EDIT_SCRIPT = 'edit_script';
export const editScriptAction = (id, { content }) => {
  return {
    type: EDIT_SCRIPT,
    payload: {
      id,
      content,
      changed: false,
    },
  };
};

export const FOCUS_EDITED_SCRIPT = 'focus_edited_script';
export const focusEditedScriptAction = (id) => {
  return {
    type: FOCUS_EDITED_SCRIPT,
    payload: id,
  };
}

export const UPDATE_EDITED_SCRIPT = 'updated_edited_script';
export const updateEditedScriptAction = (id, data) => {
  return {
    type: UPDATE_EDITED_SCRIPT,
    payload: {
      id,
      data,
    },
  };
}

export const SAVE_EDITED_SCRIPT = 'save_edited_script';
export const saveEditedScriptAction = (id) => {
  return {
    type: SAVE_EDITED_SCRIPT,
    payload: id,
  };
}

export const CLOSE_SCRIPT = 'close_script';
export const closeScriptAction = (id) => {
  return {
    type: CLOSE_SCRIPT,
    payload: id,
  };
};

export const CREATE_SCRIPT = 'create_script';
export const createScriptAction = (data) => {
  const newData = {
    content: SCRIPT_TEMPLATE,
    tempo: null,
    devices: [],
    devicesGroups: [],
    ...data,
    id: uniqid(),
  };
  return {
    type: CREATE_SCRIPT,
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    }
  };
};

export const CREATE_SCRIPTS = 'create_scripts';
export const createScriptsAction = (list) => {
  const newData = list.map((data) => {
    const newScriptData = {
      content: '',
      tempo: null,
      devices: [],
      devicesGroups: [],
      ...data,
      id: uniqid(),
    };
    return {
      ...newScriptData,
      hash: hashDataObject(newScriptData, excludeHashProps),
    };
  });
  return {
    type: CREATE_SCRIPTS,
    payload: newData,
  };
};

export const DELETE_SCRIPT = 'delete_script';
export const deleteScriptAction = (id) => {
  return {
    type: DELETE_SCRIPT,
    payload: id,
  };
};

export const SAVE_SCRIPT = 'save_script';
export const saveScriptAction = (id, data) => {
  return {
    type: SAVE_SCRIPT,
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const RUN_SCRIPT = 'run_script';
export const runScriptAction = (id) => {
  return {
    type: RUN_SCRIPT,
    payload: id,
  };
};

export const STOP_SCRIPT = 'stop_script';
export const stopScriptAction = () => {
  return {
    type: STOP_SCRIPT,
  };
};

export const CREATE_SCRIPT_FOLDER = 'create_script_folder';
export const createScriptFolderAction = (data) => {
  const newData = {
    ...data,
    id: uniqid(),
  }
  return {
    type: CREATE_SCRIPT_FOLDER,
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
}

export const DELETE_SCRIPT_FOLDER = 'delete_script_folder';
export const deleteScriptFolderAction = (id) => {
  return {
    type: DELETE_SCRIPT_FOLDER,
    payload: id,
  };
}
