import React, { MouseEventHandler, useCallback } from 'react';
import { Icon, Button, Intent } from '@blueprintjs/core';
import { ok } from 'assert';

import {
  runBoardAction,
  stopBoardAction,
  editBoardAction,
  deleteBoardAction,
  focusEditedBoardAction,
} from '../../store/actions/boards';
import ItemBrowser from '../ui/ItemBrowser';
import { showBoardDialogAction } from '../../store/actions/dialogs';
import contentRunning from '../../store/selectors/contentRunning';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { BoardId } from '../../../../common/types';
import { KodtrolDialogType } from '../../constants';

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
  const dispatch = useKodtrolDispatch();
  const runHandler:MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runBoardAction(id));
  }, [dispatch, id]);
  const stopHandler:MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopBoardAction());
  }, [dispatch]);
  const doubleClickHandler:MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
  }, []);

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
  const boards = useKodtrolSelector((state) => state.boards);
  const runBoard = useKodtrolSelector((state) => state.runBoard);
  const editBoards = useKodtrolSelector((state) => state.editBoards);
  const isContentRunning = useKodtrolSelector(contentRunning);

  const dispatch = useKodtrolDispatch();
  const editCallback = useCallback((id: BoardId) => {
    if (editBoards.find((board) => board.id === id)) {
      dispatch(focusEditedBoardAction(id));
    } else {
      const board = boards.find((board) => board.id === id);
      ok(board, 'board not found');
      dispatch(editBoardAction(id, board));
    }
  }, [dispatch, boards, editBoards]);
  const editPropsCallback = useCallback((id: BoardId) => {
    const board = boards.find((board) => board.id === id);
    ok(board, 'board not found');
    dispatch(showBoardDialogAction(KodtrolDialogType.EDIT, board));
  }, [dispatch, boards]);
  const duplicateCallback = useCallback((id: BoardId) => {
    const board = boards.find((board) => board.id === id);
    ok(board, 'board not found');
    dispatch(showBoardDialogAction(KodtrolDialogType.DUPLICATE, board));
  }, [dispatch, boards]);
  const deleteCallback = useCallback((id: BoardId) => {
    dispatch(deleteBoardAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="board"
      items={boards}
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
