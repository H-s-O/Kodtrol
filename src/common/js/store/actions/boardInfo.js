export const updateBoardInfo = (boardInfo) => {
  return {
    type: 'UPDATE_BOARD_INFO',
    payload: boardInfo,
  };
};

export const updateBoardInfoUser = (boardInfo) => {
  return {
    type: 'UPDATE_BOARD_INFO_USER',
    payload: boardInfo,
  };
};