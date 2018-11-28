import uniqid from 'uniqid';

export const updateBoards = (boards) => ({
  type: 'UPDATE_BOARDS',
  payload: boards,
});

export const selectBoard = (boardData) => ({
  type: 'SELECT_BOARD',
  payload: boardData,
});

export const createBoard = (boardData) => ({
  type: 'CREATE_BOARD',
  payload: {
    items: [],
    layers: [],
    ...boardData,
    id: uniqid(),
  },
});

export const updateBoard = (boardData) => ({
  type: 'UPDATE_BOARD',
  payload: boardData,
});

export const deleteBoard = (id) => ({
  type: 'DELETE_BOARD',
  payload: id,
});

export const saveBoard = (boardData) => ({
  type: 'SAVE_BOARD',
  payload: boardData,
});

export const updateCurrentBoard = (boardData) => ({
  type: 'UPDATE_CURRENT_BOARD',
  payload: boardData,
});

export const runBoard = (id) => ({
  type: 'RUN_BOARD',
  payload: id,
});

export const stopBoard = () => ({
  type: 'RUN_BOARD',
  payload: null,
});
