import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BoardEditor from './editor/BoardEditor';
import { updateEditedBoardAction } from '../../../../common/js/store/actions/boards';

export default function BoardEditorTab({ id }) {
  const editBoards = useSelector((state) => state.editBoards);
  const board = editBoards.find((board) => board.id === id);

  const dispatch = useDispatch();
  const changeHandler = useCallback((newValue) => {
    dispatch(updateEditedBoardAction(id, newValue));
  }, [dispatch, id]);

  return (
    <BoardEditor
      board={board}
      onChange={changeHandler}
    />
  );
}
