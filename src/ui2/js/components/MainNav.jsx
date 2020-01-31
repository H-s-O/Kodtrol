import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Navbar, Button, Alignment, Tag, Intent, Classes, Icon } from '@blueprintjs/core';
import { createSelector } from 'reselect';

import { updateConfigModal } from '../../../common/js/store/actions/modals';
import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
import TagGroup from './ui/TagGroup';
import { ICON_BOARD, ICON_TIMELINE, ICON_SCRIPT, ICON_DEVICE } from '../../../common/js/constants/icons';
import { scripts } from '../../../common/js/store/reducers';

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

  if (runDevice) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_DEVICE}
      >
        {runDevice}
      </Tag>
    )
  }

  return (
    <Tag
      minimal
      icon={ICON_DEVICE}
      title="No tested device"
    />
  )
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
    <Tag
      minimal
      icon={ICON_SCRIPT}
      title="No script running"
    />
  )
}

const renderCurrentTimeline = (props) => {
  const { runTimeline, timelinesNames } = props

  if (runTimeline) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_TIMELINE}
      >
        {timelinesNames[runTimeline]}
      </Tag>
    )
  }

  return (
    <Tag
      minimal
      icon={ICON_TIMELINE}
      title="No timeline running"
    />
  )
}

const renderCurrentBoard = (props) => {
  const { runBoard, boardsNames } = props

  if (runBoard) {
    return (
      <Tag
        minimal
        intent={Intent.SUCCESS}
        icon={ICON_BOARD}
      >
        {boardsNames[runBoard]}
      </Tag>
    )
  }

  return (
    <Tag
      minimal
      icon={ICON_BOARD}
      title="No board running"
    />
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
