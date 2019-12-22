import React from 'react';
import { connect } from "react-redux";
import { Icon, Button } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { editScriptAction, runScriptAction, stopRunScriptAction } from '../../../../common/js/store/actions/scripts';

const generateLabel = (id, name, props) => {
  const { runScript } = props;

  return (
    <>
      {name}
      {id === runScript && (
        <>
          <Icon
            style={{ marginLeft: '3px', display: 'inline-block' }}
            icon="eye-open"
            intent="success"
          />
        </>
      )}
    </>
  )
}

const generateActions = (id, props) => {
  const { doRunScript, runScript, doStopRunScript } = props;

  if (id === runScript) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent="danger"
        title="Stop running script"
        onClick={(e) => {
          e.stopPropagation();
          doStopRunScript();
        }}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run script"
      onClick={(e) => {
        e.stopPropagation();
        doRunScript(id);
      }}
    />
  )
}

function ScriptsBrowser(props) {
  const { scripts, doEditScript } = props;
  const contents = scripts.map(({ id, name }) => ({
    id,
    key: id,
    label: generateLabel(id, name, props),
    secondaryLabel: generateActions(id, props),
  }));

  return (
    <ManagedTree
      contents={contents}
      onNodeDoubleClick={({ id }) => doEditScript(id)}
    />
  );
}

const mapStateToProps = ({ scripts, runScript }) => ({
  scripts,
  runScript
});

const mapDispatchToProps = (dispatch) => ({
  doEditScript: (id) => dispatch(editScriptAction(id)),
  doRunScript: (id) => dispatch(runScriptAction(id)),
  doStopRunScript: () => dispatch(stopRunScriptAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsBrowser);
