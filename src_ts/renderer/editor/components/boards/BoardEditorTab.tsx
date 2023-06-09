import React, { useCallback } from 'react';
import { ok } from 'assert';

import BoardEditor from './editor/BoardEditor';
import { updateEditedBoardAction } from '../../store/actions/boards';
import { BoardId } from '../../../../common/types';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';

type BoardEditorTabProps = {
  id: BoardId
};

export default function BoardEditorTab({ id }: BoardEditorTabProps) {
  const editBoards = useKodtrolSelector((state) => state.editBoards);
  const board = editBoards.find((board) => board.id === id);
  ok(board, 'board not found');
  const dispatch = useKodtrolDispatch();
  const changeHandler = useCallback((newValue) => {
    dispatch(updateEditedBoardAction(id, newValue));
  }, [dispatch, id]);

  return null;
  // return (
  //   <BoardEditor
  //     board={board}
  //     onChange={changeHandler}
  //   />
  // );
}
