import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const UPDATE_BOARDS = 'update_boards';
export const updateBoardsAction = (boards) => {
  return {
    type: UPDATE_BOARDS,
    payload: boards,
  };
};

export const EDIT_BOARD = 'edit_board';
export const editBoardAction = (id, { layers, items, zoom, zoomVert, tempo }) => {
  return {
    type: EDIT_BOARD,
    payload: {
      id,
      layers,
      items,
      zoom,
      zoomVert,
      tempo,
      changed: false,
    },
  };
};

export const FOCUS_EDITED_BOARD = 'focus_edited_board';
export const focusEditedBoardAction = (id) => {
  return {
    type: FOCUS_EDITED_BOARD,
    payload: id,
  };
}

export const UPDATE_EDITED_BOARD = 'updated_edited_board';
export const updateEditedBoardAction = (id, data) => {
  return {
    type: UPDATE_EDITED_BOARD,
    payload: {
      id,
      data,
    },
  };
}

export const SAVE_EDITED_BOARD = 'save_edited_board';
export const saveEditedBoardAction = (id) => {
  return {
    type: SAVE_EDITED_BOARD,
    payload: id,
  };
}

export const CLOSE_BOARD = 'close_board';
export const closeBoardAction = (id) => {
  return {
    type: CLOSE_BOARD,
    payload: id,
  };
};

export const CREATE_BOARD = 'create_board';
export const createBoardAction = (data) => {
  const newData = {
    zoom: 1.0,
    zoomVert: 1.0,
    items: [],
    layers: [],
    tempo: null,
    ...data,
    id: uniqid(),
  };
  return {
    type: CREATE_BOARD,
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const CREATE_BOARDS = 'create_boards';
export const createBoardsAction = (list) => {
  const newData = list.map((data) => {
    const newBoardData = {
      zoom: 1.0,
      zoomVert: 1.0,
      items: [],
      layers: [],
      tempo: null,
      ...data,
      id: uniqid(),
    };
    return {
      ...newBoardData,
      hash: hashDataObject(newBoardData, excludeHashProps),
    };
  });
  return {
    type: CREATE_BOARDS,
    payload: newData,
  };
};

export const DELETE_BOARD = 'delete_board';
export const deleteBoardAction = (id) => {
  return {
    type: DELETE_BOARD,
    payload: id,
  };
};

export const SAVE_BOARD = 'save_board';
export const saveBoardAction = (id, data) => {
  return {
    type: SAVE_BOARD,
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const RUN_BOARD = 'run_board';
export const runBoardAction = (id) => {
  return {
    type: RUN_BOARD,
    payload: id,
  };
};

export const STOP_BOARD = 'stop_board';
export const stopBoardAction = () => {
  return {
    type: STOP_BOARD,
    payload: null,
  };
};
