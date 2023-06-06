import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon, Button, Intent } from '@blueprintjs/core';

import { runBoardAction, stopBoardAction, editBoardAction, deleteBoardAction, focusEditedBoardAction } from '../../../../common/js/store/actions/boards';
import ItemBrowser from '../ui/ItemBrowser';
import { showBoardDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT, DIALOG_DUPLICATE } from '../../../../common/js/constants/dialogs';
import contentRunning from '../../../../common/js/store/selectors/contentRunning';

const BoardLabel = ({ item: { name, id }, activeItemId }) => {
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

const BoardSecondaryLabel = ({ item: { id }, activeItemId }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runBoardAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopBoardAction());
  }, [dispatch]);
  const doubleClickHandler = useCallback((e) => {
    e.stopPropagation();
  });

  if (id === activeItemId) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent={Intent.DANGER}
        title="Stop running board"
        onClick={stopHandler}
        onDoubleClick={doubleClickHandler}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run board"
      onClick={runHandler}
      onDoubleClick={doubleClickHandler}
    />
  )
}

export default function BoardsBrowser() {
  const boards = useSelector((state) => state.boards);
  const boardsFolders = useSelector((state) => state.boardsFolders);
  const runBoard = useSelector((state) => state.runBoard);
  const editBoards = useSelector((state) => state.editBoards);
  const isContentRunning = useSelector(contentRunning);

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
  const duplicateCallback = useCallback((id) => {
    const board = boards.find((board) => board.id === id);
    dispatch(showBoardDialogAction(DIALOG_DUPLICATE, board));
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
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={BoardLabel}
      itemSecondaryLabelComponent={BoardSecondaryLabel}
      enableDelete={!isContentRunning}
    />
  );
}
