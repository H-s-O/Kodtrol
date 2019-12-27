import React from 'react';
import { connect } from "react-redux";
import { Icon, Button } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { runBoardAction, stopBoardAction, editBoardAction } from '../../../../common/js/store/actions/boards';

const generateLabel = (id, name, props) => {
  const { runBoard } = props

  return (
    <>
      {name}
      {id === runBoard && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent="success"
        />
      )}
    </>
  )
}

const generateActions = (id, props) => {
  const { doRunBoard, runBoard, doStopBoard } = props;

  if (id === runBoard) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent="danger"
        title="Stop running timeline"
        onClick={(e) => {
          e.stopPropagation();
          doStopBoard();
        }}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run timeline"
      onClick={(e) => {
        e.stopPropagation();
        doRunBoard(id);
      }}
    />
  )
}

function BoardsBrowser(props) {
  const { boards, doEditBoard } = props;
  const items = boards.map(({ id, name }) => ({
    id,
    key: id,
    label: generateLabel(id, name, props),
    secondaryLabel: generateActions(id, props),
  }));

  return (
    <ManagedTree
      items={items}
      onNodeDoubleClick={({ id, hasCaret }) => !hasCaret && doEditBoard(id)}
    />
  );
}

const mapStateToProps = ({ boards, runBoard }) => ({
  boards,
  runBoard
});

const mapDispatchToProps = (dispatch) => ({
  doEditBoard: (id) => dispatch(editBoardAction(id)),
  doRunBoard: (id) => dispatch(runBoardAction(id)),
  doStopBoard: () => dispatch(stopBoardAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(BoardsBrowser);
