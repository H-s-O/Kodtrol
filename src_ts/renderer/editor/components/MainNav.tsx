import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Button, Alignment, Tag, Intent, Classes, Icon } from '@blueprintjs/core';

import TagGroup from './ui/TagGroup';
import { showConfigDialogAction } from '../store/actions/dialogs';
import { toggleConsoleAction } from '../store/actions/console';
import { IOStatus } from '../../../common/constants';
import { IconType } from '../constants';

const StyledNavbar = styled(Navbar)`
  padding: 0px 10px;
`

const getStatusIntent = (status) => {
  switch (status) {
    case IOStatus.DISCONNECTED: return Intent.DANGER; break;
    case IOStatus.CONNECTED: return Intent.SUCCESS; break;
    case IOStatus.ACTIVITY: return Intent.PRIMARY; break;
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
  }, []);
  const toggleConsoleClickHandler = useCallback(() => {
    dispatch(toggleConsoleAction());
  }, []);

  return (
    <StyledNavbar>
      <StyledNavbar.Group>
        <StyledNavbar.Heading>
          Kodtrol
        </StyledNavbar.Heading>
        <ItemStatus
          icon={IconType.DEVICE}
          itemId={runDevice}
          itemNames={devicesNames}
          tooltip="No device active"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={IconType.SCRIPT}
          itemId={runScript}
          itemNames={scriptsNames}
          tooltip="No script running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={IconType.TIMELINE}
          itemId={runTimeline}
          itemNames={timelinesNames}
          tooltip="No timeline running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={IconType.BOARD}
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
          icon={IconType.INPUT}
          defaultText="No inputs"
        />
        <StyledNavbar.Divider />
        <ItemsStatuses
          items={outputs}
          statuses={ioStatus}
          rightIcon={IconType.OUTPUT}
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
