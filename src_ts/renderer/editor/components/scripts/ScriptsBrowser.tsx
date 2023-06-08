import React, { MouseEventHandler, useCallback } from 'react';
import { Icon, Button, Intent } from '@blueprintjs/core';
import { ok } from 'assert';

import {
  editScriptAction,
  runScriptAction,
  stopScriptAction,
  deleteScriptAction,
  focusEditedScriptAction,
} from '../../store/actions/scripts';
import ItemBrowser from '../ui/ItemBrowser';
import { showScriptDialogAction } from '../../store/actions/dialogs';
import contentRunning from '../../store/selectors/contentRunning';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { Script, ScriptId } from '../../../../common/types';
import { KodtrolDialogType } from '../../constants';

type ScriptLabelProps = {
  item: Pick<Script, 'id' | 'name'>
  activeItemId: ScriptId
};

const ScriptLabel = ({ item: { name, id }, activeItemId }: ScriptLabelProps) => {
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

type ScriptSecondaryLabelProps = {
  item: Pick<Script, 'id'>
  activeItemId: ScriptId
};

const ScriptSecondaryLabel = ({ item: { id }, activeItemId }: ScriptSecondaryLabelProps) => {
  const dispatch = useKodtrolDispatch();
  const runHandler: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runScriptAction(id));
  }, [dispatch, id]);
  const stopHandler: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopScriptAction());
  }, [dispatch]);
  const doubleClickHandler: MouseEventHandler = useCallback((e) => {
    // Trap accidental double clicks
    e.stopPropagation();
  }, []);

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
  const scripts = useKodtrolSelector((state) => state.scripts);
  const runScript = useKodtrolSelector((state) => state.runScript);
  const editScripts = useKodtrolSelector((state) => state.editScripts);
  const isContentRunning = useKodtrolSelector(contentRunning);

  const dispatch = useKodtrolDispatch();
  const editCallback = useCallback((id: ScriptId) => {
    if (editScripts.find((script) => script.id === id)) {
      dispatch(focusEditedScriptAction(id));
    } else {
      const script = scripts.find((script) => script.id === id);
      ok(script, 'script not found');
      dispatch(editScriptAction(id, script));
    }
  }, [dispatch, scripts, editScripts]);
  const editPropsCallback = useCallback((id: ScriptId) => {
    const script = scripts.find((script) => script.id === id);
    ok(script, 'script not found');
    dispatch(showScriptDialogAction(KodtrolDialogType.EDIT, script));
  }, [dispatch, scripts]);
  const duplicateCallback = useCallback((id: ScriptId) => {
    const script = scripts.find((script) => script.id === id);
    ok(script, 'script not found');
    dispatch(showScriptDialogAction(KodtrolDialogType.DUPLICATE, script));
  }, [dispatch, scripts]);
  const deleteCallback = useCallback((id: ScriptId) => {
    dispatch(deleteScriptAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="script"
      items={scripts}
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
