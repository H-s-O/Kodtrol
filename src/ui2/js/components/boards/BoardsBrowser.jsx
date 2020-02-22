import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon, Button, Intent } from '@blueprintjs/core';

import { runBoardAction, stopBoardAction, editBoardAction, deleteBoardAction, focusEditedBoardAction } from '../../../../common/js/store/actions/boards';
import ItemBrowser from '../ui/ItemBrowser';
import { showBoardDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT } from '../../../../common/js/constants/dialogs';

const BoardLabel = ({ name, id, activeItemId }) => {
  return (
    <>
      {name}
      {id === activeItemId && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  )
}

const BoardSecondaryLabel = ({ id, activeItemId }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runBoardAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopBoardAction());
  }, [dispatch]);

  if (id === activeItemId) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent={Intent.DANGER}
        title="Stop running timeline"
        onClick={stopHandler}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run timeline"
      onClick={runHandler}
    />
  )
}

export default function BoardsBrowser() {
  const boards = useSelector((state) => state.boards);
  const boardsFolders = useSelector((state) => state.boardsFolders);
  const runBoard = useSelector((state) => state.runBoard);
  const editBoards = useSelector((state) => state.editBoards);

  const dispatch = useDispatch();
  const editCallback = useCallback((id) => {
    if (editBoards.find((board) => board.id === id)) {
      dispatch(focusEditedBoardAction(id));
    } else {
      const board = boards.find((board) => board.id === id);
      dispatch(editBoardAction(id, board));
    }
  }, [dispatch, boards, editBoards]);
  const editPropsCallback = useCallback((id) => {
    const board = boards.find((board) => board.id === id);
    dispatch(showBoardDialogAction(DIALOG_EDIT, board));
  }, [dispatch, boards]);
  const deleteCallback = useCallback((id) => {
    dispatch(deleteBoardAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="board"
      items={boards}
      folders={boardsFolders}
      activeItemId={runBoard}
      editCallback={editCallback}
      editPropsCallback={editPropsCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={BoardLabel}
      itemSecondaryLabelComponent={BoardSecondaryLabel}
    />
  );
}
