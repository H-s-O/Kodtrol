import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Button, Intent } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { editScriptAction, runScriptAction, stopScriptAction } from '../../../../common/js/store/actions/scripts';

const ScriptLabel = ({ name, running }) => {
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

const ScriptSecondaryLabel = ({ id, running }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runScriptAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopScriptAction());
  }, [dispatch]);

  if (running) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent={Intent.DANGER}
        title="Stop running script"
        onClick={stopHandler}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run script"
      onClick={runHandler}
    />
  )
}

export default function ScriptsBrowser() {
  const scripts = useSelector((state) => state.scripts);
  const scriptsFolders = useSelector((state) => state.scriptsFolders);
  const runScript = useSelector((state) => state.runScript);

  const dispatch = useDispatch();
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      const script = scripts.find((script) => script.id === id);
      dispatch(editScriptAction(id, script));
    }
  }, [dispatch, scripts]);

  const items = scripts.map(({ id, name }) => {
    const running = id === runScript;
    return {
      id,
      key: id,
      label: (
        <ScriptLabel
          name={name}
          running={running}
        />
      ),
      secondaryLabel: (
        <ScriptSecondaryLabel
          id={id}
          running={running}
        />
      ),
    }
  });
  const folders = scriptsFolders.map(({ id, name }) => ({
    id,
    key: id,
    label: name,
    hasCaret: true,
    isExpanded: false,
    icon: 'folder-close',
  }));

  return (
    <ManagedTree
      items={items}
      folders={folders}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}
