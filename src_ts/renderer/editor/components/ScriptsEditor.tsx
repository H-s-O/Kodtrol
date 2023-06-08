import React, { useCallback, useMemo } from 'react';
import { Tab, Button, NonIdealState, Icon, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import { ok } from 'assert';

import FullHeightCard from '../../common/components/FullHeightCard';
import ScriptEditorTab from './scripts/ScriptEditorTab';
import FullHeightTabs from './ui/FullHeightTabs';
import {
  closeScriptAction,
  saveEditedScriptAction,
  focusEditedScriptAction,
  runScriptAction,
} from '../store/actions/scripts';
import { useKodtrolDispatch, useKodtrolSelector } from '../lib/hooks';
import { ItemNamesObject, ScriptId } from '../../../common/types';
import { KodtrolIconType } from '../constants';

const StyledIcon = styled(Icon)`
  margin-right: 3px;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 3px;
`;

type TabLabelProps = {
  id: ScriptId
  changed: boolean
  name: string
  closeScript: (id: ScriptId) => any
};

const TabLabel = ({ id, changed, name, closeScript }: TabLabelProps) => {
  return (
    <>
      <StyledIcon
        icon={KodtrolIconType.SCRIPT}
        intent={changed ? Intent.WARNING : undefined}
      />
      {name}
      <StyledCloseButton
        small
        minimal
        icon="small-cross"
        onClick={(e) => {
          e.stopPropagation();
          closeScript(id);
        }}
      />
    </>
  );
}

export default function ScriptsEditor() {
  const scripts = useKodtrolSelector((state) => state.scripts);
  const editScripts = useKodtrolSelector((state) => state.editScripts);
  const lastEditor = useKodtrolSelector((state) => state.lastEditor);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<ScriptId>);
  }, [scripts]);
  const activeScript = useMemo(() => {
    return editScripts.find(({ active }) => active);
  }, [editScripts]);

  const dispatch = useKodtrolDispatch();
  const saveHandler = useCallback(() => {
    if (lastEditor && lastEditor.type === 'script' && activeScript && activeScript.changed) {
      dispatch(saveEditedScriptAction(activeScript.id));
    }
  }, [dispatch, activeScript, lastEditor]);
  const saveAndRunHandler = useCallback(() => {
    if (lastEditor && lastEditor.type === 'script' && activeScript) {
      dispatch(saveEditedScriptAction(activeScript.id));
      dispatch(runScriptAction(activeScript.id));
    }
  }, [dispatch, activeScript, lastEditor]);
  const closeHandler = useCallback((id: ScriptId) => {
    const editScript = editScripts.find((script) => script.id === id);
    ok(editScript, 'editScript not found');
    if (editScript.changed) {
      // closeWarning(`Are you sure you want to close "${scriptsNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
      //   if (result) {
      //     dispatch(closeScriptAction(id));
      //   }
      // });
    } else {
      dispatch(closeScriptAction(id));
    }
  }, [dispatch, scriptsNames, editScripts]);
  const tabChangeHandler = useCallback((id) => {
    dispatch(focusEditedScriptAction(id));
  }, [dispatch]);

  useHotkeys(`${window.kodtrol_editor.IS_MAC ? 'Meta' : 'Control'}+s`, saveHandler);
  useHotkeys(`${window.kodtrol_editor.IS_MAC ? 'Meta' : 'Control'}+r`, saveAndRunHandler);

  return (
    <FullHeightCard
      className="scripts-tabs"
    >
      {editScripts && editScripts.length ? (
        <FullHeightTabs
          id="scripts_editor"
          selectedTabId={activeScript ? activeScript.id : undefined}
          onChange={tabChangeHandler}
        >
          {editScripts.map(({ id, changed }) => (
            <Tab
              key={id}
              id={id}
              panel={(
                <ScriptEditorTab
                  id={id}
                />
              )}
            >
              <TabLabel
                id={id}
                changed={changed}
                name={scriptsNames[id]}
                closeScript={closeHandler}
              />
            </Tab>
          ))}
        </FullHeightTabs>
      ) : (
        <NonIdealState
          icon={KodtrolIconType.SCRIPT}
          title="Script Editor"
          description="Double-click a script in the script browser to edit it here."
        />
      )
      }
    </FullHeightCard >
  );
};
