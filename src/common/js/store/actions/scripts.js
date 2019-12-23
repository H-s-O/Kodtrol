import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

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
export const editScriptAction = (id) => {
  return {
    type: EDIT_SCRIPT,
    payload: id,
  };
};

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
    content: '',
    previewTempo: null,
    devices: [],
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
    payload: null,
  };
};
