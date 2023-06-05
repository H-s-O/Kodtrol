import React, { useCallback, useMemo } from 'react';
import { Tab, Button, NonIdealState, Icon, Intent } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useHotkeys from '@reecelucas/react-use-hotkeys';

import FullHeightCard from './ui/FullHeightCard';
import ScriptEditorTab from './scripts/ScriptEditorTab';
import FullHeightTabs from './ui/FullHeightTabs';
import { closeScriptAction, saveEditedScriptAction, focusEditedScriptAction, runScriptAction } from '../../../common/js/store/actions/scripts';
import { ICON_SCRIPT } from '../../../common/js/constants/icons';
import { closeWarning } from '../lib/messageBoxes';
import { isMac } from '../../../common/js/lib/platforms';

const StyledIcon = styled(Icon)`
  margin-right: 3px;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 3px;
`;

const StyleFillDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const TabLabel = ({ id, changed, scriptsNames, closeScript }) => {
  return (
    <>
      <StyledIcon
        icon={ICON_SCRIPT}
        intent={changed ? Intent.WARNING : undefined}
      />
      {scriptsNames[id]}
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
  const scripts = useSelector((state) => state.scripts);
  const editScripts = useSelector((state) => state.editScripts);
  const lastEditor = useSelector((state) => state.lastEditor);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const activeScript = useMemo(() => {
    return editScripts.find(({ active }) => active);
  }, [editScripts]);

  const dispatch = useDispatch();
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
  const closeHandler = useCallback((id) => {
    const editScript = editScripts.find((script) => script.id === id);
    if (editScript.changed) {
      closeWarning(`Are you sure you want to close "${scriptsNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
        if (result) {
          dispatch(closeScriptAction(id));
        }
      });
    } else {
      dispatch(closeScriptAction(id));
    }
  }, [dispatch, scriptsNames, editScripts]);
  const tabChangeHandler = useCallback((id) => {
    dispatch(focusEditedScriptAction(id));
  }, [dispatch]);

  useHotkeys(`${isMac ? 'Meta' : 'Control'}+s`, saveHandler);
  useHotkeys(`${isMac ? 'Meta' : 'Control'}+r`, saveAndRunHandler);

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
                scriptsNames={scriptsNames}
                closeScript={closeHandler}
              />
            </Tab>
          ))}
          {/* <FullHeightTabs.Expander />
          <Button
            small
            icon="settings"
          /> */}
        </FullHeightTabs>
      ) : (
          <NonIdealState
            icon={ICON_SCRIPT}
            title="Script Editor"
            description="Double-click a script in the script browser to edit it here."
          />
        )
      }
    </FullHeightCard >
  );
}
