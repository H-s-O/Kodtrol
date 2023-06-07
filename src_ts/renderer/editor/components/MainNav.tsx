import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Navbar, Button, Alignment, Tag, Intent, Classes, Icon, IconName } from '@blueprintjs/core';

import TagGroup from './ui/TagGroup';
import { showConfigDialogAction } from '../store/actions/dialogs';
import { toggleConsoleAction } from '../store/actions/console';
import { IOStatus } from '../../../common/constants';
import { KodtrolIconType } from '../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../lib/hooks';
import {
  BoardId,
  DeviceId,
  IOStatusState,
  InputsState,
  ItemNamesObject,
  OutputsState,
  RunBoardState,
  RunDeviceState,
  RunScriptState,
  RunTimelineState,
  ScriptId,
  TimelineId,
} from '../../../common/types';

const StyledNavbar = styled(Navbar)`
  padding: 0px 10px;
`

const getStatusIntent = (status: IOStatus | null): Intent | undefined => {
  switch (status) {
    case IOStatus.DISCONNECTED: return Intent.DANGER; break;
    case IOStatus.CONNECTED: return Intent.SUCCESS; break;
    case IOStatus.ACTIVITY: return Intent.PRIMARY; break;
    default: return undefined; break;
  }
};

type ItemStatusesProps = {
  items: InputsState | OutputsState
  statuses: IOStatusState
  icon?: IconName
  rightIcon?: IconName
  defaultText: string
};

const ItemsStatuses = ({ items, statuses, icon, rightIcon, defaultText }: ItemStatusesProps) => {
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

type ItemStatusProps = {
  itemId: RunDeviceState | RunScriptState | RunTimelineState | RunBoardState
  icon: IconName
  tooltip: string
  itemNames: ItemNamesObject
};

const ItemStatus = ({ icon, itemId, itemNames, tooltip }: ItemStatusProps) => {
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
  const devices = useKodtrolSelector((state) => state.devices);
  const scripts = useKodtrolSelector((state) => state.scripts);
  const timelines = useKodtrolSelector((state) => state.timelines);
  const boards = useKodtrolSelector((state) => state.boards);
  const runDevice = useKodtrolSelector((state) => state.runDevice);
  const runScript = useKodtrolSelector((state) => state.runScript);
  const runTimeline = useKodtrolSelector((state) => state.runTimeline);
  const runBoard = useKodtrolSelector((state) => state.runBoard);
  const inputs = useKodtrolSelector((state) => state.inputs);
  const outputs = useKodtrolSelector((state) => state.outputs);
  const ioStatus = useKodtrolSelector((state) => state.ioStatus);
  const console = useKodtrolSelector((state) => state.console);

  const devicesNames = useMemo(() => {
    return devices.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<DeviceId>);
  }, [devices]);
  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<ScriptId>);
  }, [scripts]);
  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<TimelineId>);
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<BoardId>);
  }, [boards]);

  const dispatch = useKodtrolDispatch();
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
          icon={KodtrolIconType.DEVICE}
          itemId={runDevice}
          itemNames={devicesNames}
          tooltip="No device active"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={KodtrolIconType.SCRIPT}
          itemId={runScript}
          itemNames={scriptsNames}
          tooltip="No script running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={KodtrolIconType.TIMELINE}
          itemId={runTimeline}
          itemNames={timelinesNames}
          tooltip="No timeline running"
        />
        <StyledNavbar.Divider />
        <ItemStatus
          icon={KodtrolIconType.BOARD}
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
          icon={KodtrolIconType.INPUT}
          defaultText="No inputs"
        />
        <StyledNavbar.Divider />
        <ItemsStatuses
          items={outputs}
          statuses={ioStatus}
          rightIcon={KodtrolIconType.OUTPUT}
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
