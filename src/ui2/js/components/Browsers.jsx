import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Icon, Button, ButtonGroup, Popover, Position, Menu, NonIdealState } from '@blueprintjs/core';

import DeviceBrowser from './devices/DevicesBrowser';
import FullHeightCard from './ui/FullHeightCard';
import ScriptsBrowser from './scripts/ScriptsBrowser';
import MediasBrowser from './medias/MediasBrowser';
import TimelinesBrowser from './timelines/TimelinesBrowser';
import FullHeightTabs from './ui/FullHeightTabs';
import BoardsBrowser from './boards/BoardsBrowser';
import { ICON_DEVICE, ICON_SCRIPT, ICON_MEDIA, ICON_TIMELINE, ICON_BOARD } from '../../../common/js/constants/icons';
import { showDeviceDialogAction, showScriptDialogAction, showMediaDialogAction, showTimelineDialogAction, showBoardDialogAction } from '../../../common/js/store/actions/dialogs';

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

  return (
    <FullHeightCard>
      <FullHeightTabs
        id="browsers"
        selectedTabId={currentTabId}
        onChange={(newTabId) => setCurrentTabId(newTabId)}
      >
        <Tab
          id="devices"
          panel={devices ? <DeviceBrowser /> : <NonIdealState icon={ICON_DEVICE} title="Devices Browser" description={
            <>
              No devices yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_DEVICE}
            htmlTitle="Devices"
          />
        </Tab>
        <Tab
          id="scripts"
          panel={scripts ? <ScriptsBrowser /> : <NonIdealState icon={ICON_SCRIPT} title="Scripts Browser" description={
            <>
              No scripts yet. Click the <Icon icon="plus" /> above to create one.
              </>
          } />
          }
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_SCRIPT}
            htmlTitle="Scripts"
          />
        </Tab>
        <Tab
          id="medias"
          panel={medias ? <MediasBrowser /> : <NonIdealState icon={ICON_MEDIA} title="Media Browser" description={
            <>
              No medias yet. Click the <Icon icon="plus" /> above to create one.
              </>
          } />
          }
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_MEDIA}
            htmlTitle="Medias"
          />
        </Tab>
        <Tab
          id="timelines"
          panel={timelines ? <TimelinesBrowser /> : <NonIdealState icon={ICON_TIMELINE} title="Timelines Browser" description={
            <>
              No timelines yet. Click the <Icon icon="plus" /> above to create one.
              </>
          } />
          }
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_TIMELINE}
            htmlTitle="Timelines"
          />
        </Tab>
        <Tab
          id="boards"
          panel={boards ? <BoardsBrowser /> : <NonIdealState icon={ICON_BOARD} title="Boards Browser" description={
            <>
              No boards yet. Click the <Icon icon="plus" /> above to create one.
              </>
          } />
          }
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_BOARD}
            htmlTitle="Boards"
          />
        </Tab>
        <FullHeightTabs.Expander />
        <ButtonGroup>
          <Button
            small
            icon="plus"
            onClick={addClickHandler}
          />
          <Popover
            minimal
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <Menu.Item
                  text={`Add ${getTabLabel(currentTabId)} folder`}
                  icon="folder-new"
                />
              </Menu>
            }
          >
            <Button
              small
              icon="caret-down"
            />
          </Popover>
        </ButtonGroup>
      </FullHeightTabs>
    </FullHeightCard>
  )
}
