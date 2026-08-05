import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';
import { Tabs, Button, Space, Dropdown } from 'antd';
import { CaretDownOutlined, DownOutlined, PlusOutlined, PlusSquareFilled } from '@ant-design/icons';

import DeviceBrowser from './devices/DevicesBrowser';
import FullHeightCard from './ui/FullHeightCard';
import ScriptsBrowser from './scripts/ScriptsBrowser';
import MediasBrowser from './medias/MediasBrowser';
import TimelinesBrowser from './timelines/TimelinesBrowser';
import FullHeightTabs from './ui/FullHeightTabs';
import BoardsBrowser from './boards/BoardsBrowser';
import { ICON_DEVICE, ICON_SCRIPT, ICON_MEDIA, ICON_TIMELINE, ICON_BOARD } from '../../../common/js/constants/icons';
import {
  showDeviceDialogAction,
  showScriptDialogAction,
  showMediaDialogAction,
  showTimelineDialogAction,
  showBoardDialogAction,
  showImportDialogAction,
} from '../../../common/js/store/actions/dialogs';
import {
  DIALOG_IMPORT_DEVICES,
  DIALOG_IMPORT_SCRIPTS,
  DIALOG_IMPORT_MEDIAS,
  DIALOG_IMPORT_TIMELINES,
  DIALOG_IMPORT_BOARDS,
} from '../../../common/js/constants/dialogs';
import { BoardIcon, DeviceIcon, MediaIcon, ScriptIcon, TimelineIcon } from './ui/Icons';

const defaultTabId = 'devices';

const getTabLabel = (tabId) => {
  switch (tabId) {
    case 'devices': return 'device'; break;
    case 'scripts': return 'script'; break;
    case 'medias': return 'media'; break;
    case 'timelines': return 'timeline'; break;
    case 'boards': return 'board'; break;
    default: return null; break;
  }
}

export default function Browsers() {
  const { devices, scripts, medias, timelines, boards } = useSelector((state) => ({
    devices: state.devices.length,
    scripts: state.scripts.length,
    medias: state.medias.length,
    timelines: state.timelines.length,
    boards: state.boards.length,
  }));

  const [currentTabId, setCurrentTabId] = useState(defaultTabId);

  const dispatch = useDispatch();
  const addClickHandler = useCallback(() => {
    switch (currentTabId) {
      case 'devices':
        dispatch(showDeviceDialogAction());
        break;
      case 'scripts':
        dispatch(showScriptDialogAction());
        break;
      case 'medias':
        dispatch(showMediaDialogAction());
        break;
      case 'timelines':
        dispatch(showTimelineDialogAction());
        break;
      case 'boards':
        dispatch(showBoardDialogAction());
        break;
    }
  }, [currentTabId, dispatch]);
  const addItemClickHandler = useCallback(({ key }) => {
    if (key === 'import') {
      switch (currentTabId) {
        case 'devices':
          dispatch(showImportDialogAction(DIALOG_IMPORT_DEVICES));
          break;
        case 'scripts':
          dispatch(showImportDialogAction(DIALOG_IMPORT_SCRIPTS));
          break;
        case 'medias':
          dispatch(showImportDialogAction(DIALOG_IMPORT_MEDIAS));
          break;
        case 'timelines':
          dispatch(showImportDialogAction(DIALOG_IMPORT_TIMELINES));
          break;
        case 'boards':
          dispatch(showImportDialogAction(DIALOG_IMPORT_BOARDS));
          break;
      }
    }
  }, [currentTabId, dispatch]);

  return (
    <FullHeightCard
      size="small"
      className="browsers-tabs"
    >
      <Tabs
        id="browsers"
        activeKey={currentTabId}
        onChange={(newTabId) => setCurrentTabId(newTabId)}
        tabBarGutter={18}
        size='large'
        // @TODO optimize tabBarExtraContent (memoize?)
        tabBarExtraContent={{
          right: (
            <Dropdown.Button
              onClick={addClickHandler}
              size='small'
              trigger='click'
              icon={<DownOutlined />}
              menu={{
                onClick: addItemClickHandler,
                items: [
                  {
                    key: 'import',
                    label: `Import ${getTabLabel(currentTabId)}(s) from project...`
                  }
                ]
              }}>
              <PlusOutlined />
            </Dropdown.Button>
          )
        }}
        // @TODO optimize items (memoize?)
        items={[
          {
            key: 'devices',
            title: 'Devices',
            icon: DeviceIcon,
            children: (
              devices ? <DeviceBrowser /> : <NonIdealState icon={ICON_DEVICE} title="Devices Browser" description={
                <>
                  No devices yet. Click the <Icon icon="plus" /> above to create one.
                </>
              } />
            )
          },
          {
            key: 'scripts',
            icon: ScriptIcon,
            children: (
              scripts ? <ScriptsBrowser /> : <NonIdealState icon={ICON_SCRIPT} title="Scripts Browser" description={
                <>
                  No scripts yet. Click the <Icon icon="plus" /> above to create one.
                </>
              } />
            )
          },
          {
            key: 'medias',
            icon: MediaIcon,
            children: (
              medias ? <MediasBrowser /> : <NonIdealState icon={ICON_MEDIA} title="Media Browser" description={
                <>
                  No medias yet. Click the <Icon icon="plus" /> above to create one.
                </>
              } />
            )
          },
          {
            key: 'timelines',
            icon: TimelineIcon,
            children: (
              timelines ? <TimelinesBrowser /> : <NonIdealState icon={ICON_TIMELINE} title="Timelines Browser" description={
                <>
                  No timelines yet. Click the <Icon icon="plus" /> above to create one.
                </>
              } />
            )
          },
          {
            key: 'boards',
            icon: BoardIcon,
            children: (
              boards ? <BoardsBrowser /> : <NonIdealState icon={ICON_BOARD} title="Boards Browser" description={
                <>
                  No boards yet. Click the <Icon icon="plus" /> above to create one.
                </>
              } />
            )
          }
        ]}
      />
    </FullHeightCard>
  )
}
