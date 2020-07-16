import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Button, Intent } from '@blueprintjs/core';

import { editScriptAction, runScriptAction, stopScriptAction, deleteScriptAction, focusEditedScriptAction } from '../../../../common/js/store/actions/scripts';
import ItemBrowser from '../ui/ItemBrowser';
import { showScriptDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT, DIALOG_DUPLICATE } from '../../../../common/js/constants/dialogs';
import contentRunning from '../../../../common/js/store/selectors/contentRunning';

const ScriptLabel = ({ item: { name, id }, activeItemId }) => {
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

const ScriptSecondaryLabel = ({ item: { id }, activeItemId }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runScriptAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopScriptAction());
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
        title="Stop running script"
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
      title="Run script"
      onClick={runHandler}
      onDoubleClick={doubleClickHandler}
    />
  )
}

export default function ScriptsBrowser() {
  const scripts = useSelector((state) => state.scripts);
  const scriptsFolders = useSelector((state) => state.scriptsFolders);
  const runScript = useSelector((state) => state.runScript);
  const editScripts = useSelector((state) => state.editScripts);
  const isContentRunning = useSelector(contentRunning);

  const dispatch = useDispatch();
  const editCallback = useCallback((id) => {
    if (editScripts.find((script) => script.id === id)) {
      dispatch(focusEditedScriptAction(id));
    } else {
      const script = scripts.find((script) => script.id === id);
      dispatch(editScriptAction(id, script));
    }
  }, [dispatch, scripts, editScripts]);
  const editPropsCallback = useCallback((id) => {
    const script = scripts.find((script) => script.id === id);
    dispatch(showScriptDialogAction(DIALOG_EDIT, script));
  }, [dispatch, scripts]);
  const duplicateCallback = useCallback((id) => {
    const script = scripts.find((script) => script.id === id);
    dispatch(showScriptDialogAction(DIALOG_DUPLICATE, script));
  }, [dispatch, scripts]);
  const deleteCallback = useCallback((id) => {
    dispatch(deleteScriptAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="script"
      items={scripts}
      folders={scriptsFolders}
      activeItemId={runScript}
      editCallback={editCallback}
      editPropsCallback={editPropsCallback}
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={ScriptLabel}
      itemSecondaryLabelComponent={ScriptSecondaryLabel}
      enableDelete={!isContentRunning}
    />
  );
}
