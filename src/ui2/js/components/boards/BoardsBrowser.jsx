import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon, Button, Intent } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { runBoardAction, stopBoardAction, editBoardAction } from '../../../../common/js/store/actions/boards';

const BoardLabel = ({ name, running }) => {
  return (
    <>
      {name}
      {running && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  )
}

const BoardSecondaryLabel = ({ id, running }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runBoardAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopBoardAction());
  }, [dispatch]);

  if (running) {
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
  const runBoard = useSelector((state) => state.runBoard);

  const dispatch = useDispatch();
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      const board = boards.find((board) => board.id === id);
      dispatch(editBoardAction(id, board));
    }
  })

  const items = boards.map(({ id, name }) => {
    const running = id === runBoard;
    return {
      id,
      key: id,
      label: (
        <BoardLabel
          name={name}
          running={running}
        />
      ),
      secondaryLabel: (
        <BoardSecondaryLabel
          id={id}
          running={running}
        />
      ),
    }
  });

  return (
    <ManagedTree
      items={items}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}
