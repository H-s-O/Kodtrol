import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Button, Alignment, Tag, Intent, Classes, Icon } from '@blueprintjs/core';

import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
import TagGroup from './ui/TagGroup';
import { ICON_BOARD, ICON_TIMELINE, ICON_SCRIPT, ICON_DEVICE, ICON_INPUT, ICON_OUTPUT } from '../../../common/js/constants/icons';
import { showConfigDialogAction } from '../../../common/js/store/actions/dialogs';
import { toggleConsoleAction } from '../../../common/js/store/actions/console';

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
};

const ItemsStatuses = ({ items, statuses, icon, rightIcon, defaultText }) => {
  if (items && items.length) {
    return (
      <TagGroup>
        {items.map(({ id, name }, index) => {
          const status = id in statuses ? statuses[id] : null;

          return (
            <Tag
              minimal
              key={index}
              intent={getStatusIntent(status)}
              icon={icon}
              rightIcon={rightIcon}
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
      {defaultText}
    </span>
  );
};

const ItemStatus = ({ icon, itemId, itemNames, tooltip }) => {
  return (
    <Tag
      minimal
      intent={itemId ? Intent.SUCCESS : undefined}
      icon={itemId ? icon : undefined}
      title={!itemId ? tooltip : undefined}
    >
      {itemId ? (
        itemNames[itemId]
      ) : (
          <span
            className={Classes.TEXT_MUTED}
          >
            <Icon
              icon={icon}
            />
          </span>
        )}
    </Tag>
  );
};

export default function MainNav() {
  const devices = useSelector((state) => state.devices);
  const scripts = useSelector((state) => state.scripts);
  const timelines = useSelector((state) => state.timelines);
  const boards = useSelector((state) => state.boards);
  const runDevice = useSelector((state) => state.runDevice);
  const runScript = useSelector((state) => state.runScript);
  const runTimeline = useSelector((state) => state.runTimeline);
  const runBoard = useSelector((state) => state.runBoard);
  const inputs = useSelector((state) => state.inputs);
  const outputs = useSelector((state) => state.outputs);
  const ioStatus = useSelector((state) => state.ioStatus);
  const console = useSelector((state) => state.console);

  const devicesNames = useMemo(() => {
    return devices.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [devices]);
  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [boards]);

  const dispatch = useDispatch();
  const openConfigClickHandler = useCallback(() => {
    dispatch(showConfigDialogAction());
  });
  const toggleConsoleClickHandler = useCallback(() => {
    dispatch(toggleConsoleAction());
  })

  return (
    <StyledNavbar>
      <StyledNavbar.Group>
        <StyledNavbar.Heading>
          Kodtrol
        </StyledNavbar.Heading>
        <ItemStatus
          icon={ICON_DEVICE}
          itemId={runDevice}
          itemNames={devicesNames}
          tooltip="No device tested"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={ICON_SCRIPT}
          itemId={runScript}
          itemNames={scriptsNames}
          tooltip="No script running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={ICON_TIMELINE}
          itemId={runTimeline}
          itemNames={timelinesNames}
          tooltip="No timeline running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={ICON_BOARD}
          itemId={runBoard}
          itemNames={boardsNames}
          tooltip="No board running"
        />
      </StyledNavbar.Group>
      <StyledNavbar.Group
        align={Alignment.RIGHT}
      >
        <ItemsStatuses
          items={inputs}
          statuses={ioStatus}
          icon={ICON_INPUT}
          defaultText="No inputs"
        />
        <StyledNavbar.Divider />
        <ItemsStatuses
          items={outputs}
          statuses={ioStatus}
          rightIcon={ICON_OUTPUT}
          defaultText="No outputs"
        />
        <StyledNavbar.Divider />
        <Button
          small
          icon="console"
          title="Toggle console window"
          active={console}
          onClick={toggleConsoleClickHandler}
        />
        <StyledNavbar.Divider />
        <Button
          small
          icon="cog"
          title="Open project configuration"
          onClick={openConfigClickHandler}
        />
      </StyledNavbar.Group>
    </StyledNavbar>
  );
}
