import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Alignment, Intent, Classes, Icon } from '@blueprintjs/core';
import { Card, Divider, Flex, Layout, Space, Tag, Typography, Button } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
// import TagGroup from './ui/TagGroup';
import { ICON_BOARD, ICON_TIMELINE, ICON_SCRIPT, ICON_DEVICE, ICON_INPUT, ICON_OUTPUT } from '../../../common/js/constants/icons';
import { showConfigDialogAction } from '../../../common/js/store/actions/dialogs';
import { toggleConsoleAction } from '../../../common/js/store/actions/console';
import { BoardIcon, ConsoleIcon, DeviceIcon, IOInputIcon, IOOutputIcon, ScriptIcon, SettingsIcon, TimelineIcon } from './ui/Icons';

const headerStyle = { padding: '0px 10px' };
const headerTitleStyle = { margin: 0, marginRight: '1em' };
const singleTagStyle = { marginRight: 0 };

const StyledNavbar = styled(Navbar)`
  padding: 0px 10px;
`

const getStatusColor = (status) => {
  switch (status) {
    case IO_DISCONNECTED: return "error"; break;
    case IO_CONNECTED: return "success"; break;
    case IO_ACTIVITY: return "processing"; break;
    default: return undefined; break;
  }
};

const ItemsStatuses = ({ items, statuses, icon, defaultText }) => {
  if (items && items.length) {
    return (
      <Space>
        {items.map(({ id, name }, index) => {
          const status = id in statuses ? statuses[id] : null;

          return (
            <Tag
              key={id}
              style={index === items.length - 1 ? singleTagStyle : undefined}
              color={getStatusColor(status)}
              icon={icon}
              bordered={false}
            >
              {name}
            </Tag>
          );
        })}
      </Space>
    )
  }

  return (
    <Typography.Text type="secondary">
      {defaultText}
    </Typography.Text>
  );
};

const ItemStatus = ({ icon, itemId, itemNames, tooltip }) => {
  return (
    <Tag
      style={singleTagStyle}
      icon={icon}
      bordered={false}
      color={itemId ? "success" : undefined}
      title={!itemId ? tooltip : undefined}
    >
      {itemId ? (
        itemNames[itemId]
      ) : undefined}
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
    <Card size="small">
      {/* <Layout.Header style={headerStyle}> */}
      <Flex justify="space-between">
        <Space>
          <h3 style={headerTitleStyle}>
            Kodtrol
          </h3>
          <ItemStatus
            icon={DeviceIcon}
            itemId={runDevice}
            itemNames={devicesNames}
            tooltip="No active device test"
          />
          <Divider type="vertical" />
          <ItemStatus
            icon={ScriptIcon}
            itemId={runScript}
            itemNames={scriptsNames}
            tooltip="No active script"
          />
          <Divider type="vertical" />
          <ItemStatus
            icon={TimelineIcon}
            itemId={runTimeline}
            itemNames={timelinesNames}
            tooltip="No active timeline"
          />
          <Divider type="vertical" />
          <ItemStatus
            icon={BoardIcon}
            itemId={runBoard}
            itemNames={boardsNames}
            tooltip="No active board"
          />
        </Space>
        <Space>
          <ItemsStatuses
            items={inputs}
            statuses={ioStatus}
            icon={IOInputIcon}
            defaultText="No inputs"
          />
          <Divider type="vertical" />
          <ItemsStatuses
            items={outputs}
            statuses={ioStatus}
            icon={IOOutputIcon}
            defaultText="No outputs"
          />
          <Divider type="vertical" />
          <Button
            size="small"
            icon={ConsoleIcon}
            title="Toggle console window"
            type={console ? "primary" : undefined}
            onClick={toggleConsoleClickHandler}
          />
          <Divider type="vertical" />
          <Button
            variant="solid"
            size="small"
            icon={SettingsIcon}
            title="Open project configuration"
            onClick={openConfigClickHandler}
          />
        </Space>
      </Flex>
      {/* </Layout.Header> */}
    </Card>
  );
}
