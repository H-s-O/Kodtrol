import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Navbar, Button, Alignment, Tag, Intent, Classes, Icon } from '@blueprintjs/core';
import { createSelector } from 'reselect';

import { updateConfigModal } from '../../../common/js/store/actions/modals';
import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
import TagGroup from './ui/TagGroup';
import { ICON_BOARD, ICON_TIMELINE, ICON_SCRIPT, ICON_DEVICE } from '../../../common/js/constants/icons';

const StyledNavbar = styled(Navbar)`
  padding: 0px 10px;
`

const getStatusIntent = (status) => {
  switch (status) {
    case IO_DISCONNECTED: return Intent.DANGER; break;
    case IO_CONNECTED: return Intent.SUCCESS; break;
    case IO_ACTIVITY: return Intent.PRIMARY; break;
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
      className={Classes.TEXT_MUTED}
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
      className={Classes.TEXT_MUTED}
    >
      No inputs
    </span>
  );
}

const renderCurrentDevice = (props) => {
  const { runDevice } = props

  return (
    <Tag
      minimal
      intent={runDevice ? Intent.SUCCESS : undefined}
      icon={runDevice ? ICON_DEVICE : undefined}
      title={!runDevice ? 'No device tested' : undefined}
    >
      {runDevice ? (
        runDevice
      ) : (
          <span
            className={Classes.TEXT_MUTED}
          >
            <Icon
              icon={ICON_DEVICE}
            />
          </span>
        )}
    </Tag>
  );
}

const renderCurrentScript = (props) => {
  const { runScript, scriptsNames } = props

  return (
    <Tag
      minimal
      intent={runScript ? Intent.SUCCESS : undefined}
      icon={runScript ? ICON_SCRIPT : undefined}
      title={!runScript ? 'No device tested' : undefined}
    >
      {runScript ? (
        scriptsNames[runScript]
      ) : (
          <span
            className={Classes.TEXT_MUTED}
          >
            <Icon
              icon={ICON_SCRIPT}
            />
          </span>
        )}
    </Tag>
  );
}

const renderCurrentTimeline = (props) => {
  const { runTimeline, timelinesNames } = props

  return (
    <Tag
      minimal
      intent={runTimeline ? Intent.SUCCESS : undefined}
      icon={runTimeline ? ICON_TIMELINE : undefined}
      title={!runTimeline ? 'No device tested' : undefined}
    >
      {runTimeline ? (
        timelinesNames[runTimeline]
      ) : (
          <span
            className={Classes.TEXT_MUTED}
          >
            <Icon
              icon={ICON_TIMELINE}
            />
          </span>
        )}
    </Tag>
  );
}

const renderCurrentBoard = (props) => {
  const { runBoard, boardsNames } = props

  return (
    <Tag
      minimal
      intent={runBoard ? Intent.SUCCESS : undefined}
      icon={runBoard ? ICON_BOARD : undefined}
      title={!runBoard ? 'No device tested' : undefined}
    >
      {runBoard ? (
        boardsNames[runBoard]
      ) : (
          <span
            className={Classes.TEXT_MUTED}
          >
            <Icon
              icon={ICON_BOARD}
            />
          </span>
        )}
    </Tag>
  );
}

function MainNav(props) {
  const { doShowConfigModal } = props;

  return (
    <StyledNavbar>
      <StyledNavbar.Group>
        <StyledNavbar.Heading>
          Kodtrol
        </StyledNavbar.Heading>
        {renderCurrentDevice(props)}
        <StyledNavbar.Divider />
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

const timelinesNamesSelector = createSelector(
  [(timelines) => timelines],
  (timelines) => timelines.reduce((obj, { id, name }) => ({
    ...obj,
    [id]: name,
  }), {})
)

const boardsNamesSelector = createSelector(
  [(boards) => boards],
  (boards) => boards.reduce((obj, { id, name }) => ({
    ...obj,
    [id]: name,
  }), {})
)

const mapStateToProps = ({ outputs, inputs, ioStatus, runDevice, runScript, runTimeline, runBoard, scripts, timelines, boards }) => ({
  outputs,
  inputs,
  ioStatus,
  runDevice,
  runScript,
  runTimeline,
  runBoard,
  scriptsNames: scriptsNamesSelector(scripts),
  timelinesNames: timelinesNamesSelector(timelines),
  boardsNames: boardsNamesSelector(boards),
});

const mapDispatchToProps = (dispatch) => ({
  doShowConfigModal: () => dispatch(updateConfigModal(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
