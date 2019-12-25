import React from 'react';
import { Tab, Button, NonIdealState, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import styled from 'styled-components';

import FullHeightCard from '../ui/FullHeightCard';
import CodeEditor from './CodeEditor';
import FullHeightTabs from '../ui/FullHeightTabs';
import { closeScriptAction } from '../../../../common/js/store/actions/scripts';
import { createSelector } from 'reselect';
import { ICON_SCRIPT } from '../../../../common/js/constants/icons';

const StyledIcon = styled(Icon)`
  margin-right: 3px;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 3px;
`;

function ScriptsEditor(props) {
  const { editScripts, scriptsNames, closeScript } = props;
  const defaultTab = editScripts[0];

  return (
    <FullHeightCard>
      {editScripts && editScripts.length ? (
        <FullHeightTabs
          defaultSelectedTabId={defaultTab}
        >
          {editScripts.map((id) => (
            <Tab
              key={id}
              id={id}
              panel={<CodeEditor />}
            >
              <StyledIcon
                icon={ICON_SCRIPT}
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
            </Tab>
          ))}
          <FullHeightTabs.Expander />
          <Button
            small
            icon="settings"
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
