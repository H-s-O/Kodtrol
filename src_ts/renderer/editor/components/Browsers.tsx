import React, { useState, useCallback } from 'react';
import {
  Tab,
  Icon,
  Button,
  ButtonGroup,
  Popover,
  Position,
  Menu,
  NonIdealState,
  IconSize,
  MenuItem,
} from '@blueprintjs/core';

import FullHeightCard from '../../common/components/FullHeightCard';
import DeviceBrowser from './devices/DevicesBrowser';
import ScriptsBrowser from './scripts/ScriptsBrowser';
import MediasBrowser from './medias/MediasBrowser';
import TimelinesBrowser from './timelines/TimelinesBrowser';
import FullHeightTabs from './ui/FullHeightTabs';
import BoardsBrowser from './boards/BoardsBrowser';
import {
  showDeviceDialogAction,
  showScriptDialogAction,
  showMediaDialogAction,
  showTimelineDialogAction,
  showBoardDialogAction,
  showImportDialogAction,
} from '../store/actions/dialogs';
import { KodtrolDialogType, KodtrolIconType } from '../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../lib/hooks';

const defaultTabId = 'devices';

const getTabLabel = (tabId: string): string | null => {
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
  const { devices, scripts, medias, timelines, boards } = useKodtrolSelector((state) => ({
    devices: state.devices.length,
    scripts: state.scripts.length,
    medias: state.medias.length,
    timelines: state.timelines.length,
    boards: state.boards.length,
  }));

  const [currentTabId, setCurrentTabId] = useState(defaultTabId);

  const dispatch = useKodtrolDispatch();
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
  const importClickHandler = useCallback(() => {
    switch (currentTabId) {
      case 'devices':
        dispatch(showImportDialogAction(KodtrolDialogType.IMPORT_DEVICES));
        break;
      case 'scripts':
        dispatch(showImportDialogAction(KodtrolDialogType.IMPORT_SCRIPTS));
        break;
      case 'medias':
        dispatch(showImportDialogAction(KodtrolDialogType.IMPORT_MEDIAS));
        break;
      case 'timelines':
        dispatch(showImportDialogAction(KodtrolDialogType.IMPORT_TIMELINES));
        break;
      case 'boards':
        dispatch(showImportDialogAction(KodtrolDialogType.IMPORT_BOARDS));
        break;
    }
  }, [currentTabId, dispatch]);

  return (
    <FullHeightCard
      className="browsers-tabs"
    >
      <FullHeightTabs
        id="browsers"
        withBorder
        selectedTabId={currentTabId}
        onChange={(newTabId: string) => setCurrentTabId(newTabId)}
      >
        <Tab
          id="devices"
          panel={devices ? <DeviceBrowser /> : <NonIdealState icon={KodtrolIconType.DEVICE} title="Devices Browser" description={
            <>
              No devices yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={IconSize.LARGE}
            icon={KodtrolIconType.DEVICE}
            htmlTitle="Devices"
          />
        </Tab>
        <Tab
          id="scripts"
          panel={scripts ? <ScriptsBrowser /> : <NonIdealState icon={KodtrolIconType.SCRIPT} title="Scripts Browser" description={
            <>
              No scripts yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={IconSize.LARGE}
            icon={KodtrolIconType.SCRIPT}
            htmlTitle="Scripts"
          />
        </Tab>
        {/* <Tab
          id="medias"
          panel={medias ? <MediasBrowser /> : <NonIdealState icon={KodtrolIconType.MEDIA} title="Media Browser" description={
            <>
              No medias yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={IconSize.LARGE}
            icon={KodtrolIconType.MEDIA}
            htmlTitle="Medias"
          />
        </Tab>
        <Tab
          id="timelines"
          panel={timelines ? <TimelinesBrowser /> : <NonIdealState icon={KodtrolIconType.TIMELINE} title="Timelines Browser" description={
            <>
              No timelines yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={IconSize.LARGE}
            icon={KodtrolIconType.TIMELINE}
            htmlTitle="Timelines"
          />
        </Tab>
        <Tab
          id="boards"
          panel={boards ? <BoardsBrowser /> : <NonIdealState icon={KodtrolIconType.BOARD} title="Boards Browser" description={
            <>
              No boards yet. Click the <Icon icon="plus" /> above to create one.
            </>
          } />
          }
        >
          <Icon
            iconSize={IconSize.LARGE}
            icon={KodtrolIconType.BOARD}
            htmlTitle="Boards"
          />
        </Tab> */}
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
                <MenuItem
                  text={`Import ${getTabLabel(currentTabId)}(s) from project...`}
                  icon="import"
                  onClick={importClickHandler}
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
};
