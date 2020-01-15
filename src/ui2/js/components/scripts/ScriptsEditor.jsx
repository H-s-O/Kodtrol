import React, { useState, useCallback } from 'react';
import { Tab, Button, NonIdealState, Icon, Intent } from '@blueprintjs/core';
import { connect, useDispatch } from 'react-redux';
import styled from 'styled-components';

import FullHeightCard from '../ui/FullHeightCard';
import ScriptEditor from './ScriptEditor';
import FullHeightTabs from '../ui/FullHeightTabs';
import { closeScriptAction, saveEditedScriptAction } from '../../../../common/js/store/actions/scripts';
import { createSelector } from 'reselect';
import { ICON_SCRIPT } from '../../../../common/js/constants/icons';

const StyledIcon = styled(Icon)`
  margin-right: 3px;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 3px;
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

function ScriptsEditor({ editScripts, scriptsNames, closeScript }) {
  const defaultTabId = editScripts.length ? editScripts[0].id : null;

  const [currentTabId, setCurrentTabId] = useState(defaultTabId);

  const dispatch = useDispatch();
  const saveHandler = useCallback(() => {
    dispatch(saveEditedScriptAction(currentTabId));
  }, [dispatch, currentTabId]);

  return (
    <FullHeightCard>
      {editScripts && editScripts.length ? (
        <FullHeightTabs
          selectedTabId={currentTabId}
          onChange={(newTabId) => setCurrentTabId(newTabId)}
        >
          {editScripts.map(({ id, changed }) => (
            <Tab
              key={id}
              id={id}
              panel={(
                <ScriptEditor
                  id={id}
                />
              )}
            >
              <TabLabel
                id={id}
                changed={changed}
                scriptsNames={scriptsNames}
                closeScript={closeScript}
              />
            </Tab>
          ))}
          <FullHeightTabs.Expander />
          <Button
            small
            icon="settings"
            onClick={saveHandler}
          />
        </FullHeightTabs>
      ) : (
          <NonIdealState
            icon={ICON_SCRIPT}
            description="Double-click a script in the script browser to edit it here."
          />
        )}
    </FullHeightCard>
  );
}

const scriptsNamesSelector = createSelector(
  [(scripts) => scripts],
  (scripts) => scripts.reduce((obj, { id, name }) => ({
    ...obj,
    [id]: name,
  }), {}),
)

const mapStateToProps = ({ editScripts, scripts }) => ({
  editScripts,
  scriptsNames: scriptsNamesSelector(scripts)
});

const mapDispatchToProps = (dispatch) => ({
  closeScript: (id) => dispatch(closeScriptAction(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsEditor);
