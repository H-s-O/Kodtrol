import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Navbar, Button, Alignment, Tag, Intent } from '@blueprintjs/core';
import { createSelector } from 'reselect';

import { updateConfigModal } from '../../../common/js/store/actions/modals';
import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
import TagGroup from './ui/TagGroup';
import { ICON_BOARD, ICON_TIMELINE, ICON_SCRIPT } from '../../../common/js/constants/icons';
import { scripts } from '../../../common/js/store/reducers';

const StyledNavbar = styled(Navbar)`
  padding: 0px 10px;
`

const getStatusIntent = (status) => {
  switch (status) {
    case IO_DISCONNECTED: return 'danger'; break;
    case IO_CONNECTED: return 'success'; break;
    case IO_ACTIVITY: return 'primary'; break;
    default: return null; break;
  }
}

const renderOutputs = (props) => {
  const { outputs, ioStatus } = props;

  if (outputs && outputs.length) {
    return (
      <TagGroup>
        {outputs.map(({ id, name }, index) => {
          const status = id in ioStatus ? ioStatus[id] : null;

          return (
            <Tag
              minimal
              key={`output-${index}`}
              intent={getStatusIntent(status)}
              rightIcon="log-out"
            >
              {name}
            </Tag>
          );
        })}
      </TagGroup>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No outputs
    </span>
  );
}

const renderInputs = (props) => {
  const { inputs, ioStatus } = props;

  if (inputs && inputs.length) {
    return (
      <TagGroup>
        {inputs.map(({ id, name }, index) => {
          const status = id in ioStatus ? ioStatus[id] : null;

          return (
            <Tag
              minimal
              key={`input-${index}`}
              intent={getStatusIntent(status)}
              icon="log-in"
            >
              {name}
            </Tag>
          );
        })}
      </TagGroup>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No inputs
    </span>
  );
}

const renderCurrentScript = (props) => {
  const { runScript, scriptsNames } = props

  if (runScript) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_SCRIPT}
      >
        {scriptsNames[runScript]}
      </Tag>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No running script
    </span>
  )
}

const renderCurrentTimeline = (props) => {
  const { runTimeline } = props

  if (runTimeline) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_TIMELINE}
      >
        {runTimeline}
      </Tag>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No running timeline
    </span>
  )
}

const renderCurrentBoard = (props) => {
  const { runBoard } = props

  if (runBoard) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_BOARD}
      >
        {runBoard}
      </Tag>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No running board
    </span>
  )
}

function MainNav(props) {
  const { doShowConfigModal } = props;

  return (
    <StyledNavbar>
      <StyledNavbar.Group>
        <StyledNavbar.Heading>
          Kodtrol
        </StyledNavbar.Heading>
        {renderCurrentScript(props)}
        <StyledNavbar.Divider />
        {renderCurrentTimeline(props)}
        <StyledNavbar.Divider />
        {renderCurrentBoard(props)}
      </StyledNavbar.Group>
      <StyledNavbar.Group
        align={Alignment.RIGHT}
      >
        {renderInputs(props)}
        <StyledNavbar.Divider />
        {renderOutputs(props)}
        <StyledNavbar.Divider />
        <Button
          small
          icon="cog"
          onClick={doShowConfigModal}
        />
      </StyledNavbar.Group>
    </StyledNavbar>
  );
}

const scriptsNamesSelector = createSelector(
  [(scripts) => scripts],
  (scripts) => scripts.reduce((obj, { id, name }) => ({
    ...obj,
    [id]: name,
  }), {})
)

const mapStateToProps = ({ outputs, inputs, ioStatus, runScript, runTimeline, runBoard, scripts, timelines, boards }) => ({
  outputs,
  inputs,
  ioStatus,
  runScript,
  runTimeline,
  runBoard,
  scriptsNames: scriptsNamesSelector(scripts),
});

const mapDispatchToProps = (dispatch) => ({
  doShowConfigModal: () => dispatch(updateConfigModal(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
