import React from 'react';
import { connect } from "react-redux";
import { Icon, Button } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { editScriptAction, runScriptAction, stopScriptAction } from '../../../../common/js/store/actions/scripts';

const generateLabel = (id, name, props) => {
  const { runScript } = props;

  return (
    <>
      {name}
      {id === runScript && (
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
  const { doRunScript, runScript, doStopScript } = props;

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
          doStopScript();
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
  const { scripts, scriptsFolders, doEditScript } = props;
  const items = scripts.map(({ id, name }) => ({
    id,
    key: id,
    label: generateLabel(id, name, props),
    secondaryLabel: generateActions(id, props),
  }));
  const folders = scriptsFolders.map(({ id, name }) => ({
    id,
    key: id,
    label: name,
    hasCaret: true,
    isExpanded: false,
    icon: 'folder-close'
  }));

  return (
    <ManagedTree
      items={items}
      folders={folders}
      onNodeDoubleClick={({ id, hasCaret }) => !hasCaret && doEditScript(id)}
    />
  );
}

const mapStateToProps = ({ scripts, scriptsFolders, runScript }) => ({
  scripts,
  scriptsFolders,
  runScript
});

const mapDispatchToProps = (dispatch) => ({
  doEditScript: (id) => dispatch(editScriptAction(id)),
  doRunScript: (id) => dispatch(runScriptAction(id)),
  doStopScript: () => dispatch(stopScriptAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsBrowser);
