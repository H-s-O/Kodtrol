import React from 'react';
import { Tab, Icon, Button, ButtonGroup, Popover, Position, Menu } from '@blueprintjs/core';

import DeviceBrowser from './devices/DevicesBrowser';
import FullHeightCard from './ui/FullHeightCard';
import ScriptsBrowser from './scripts/ScriptsBrowser';
import MediasBrowser from './medias/MediasBrowser';
import TimelinesBrowser from './timelines/TimelinesBrowser';
import FullHeightTabs from './ui/FullHeightTabs';
import BoardsBrowser from './boards/BoardsBrowser';
import { ICON_DEVICE, ICON_SCRIPT, ICON_MEDIA, ICON_TIMELINE, ICON_BOARD } from '../../../common/js/constants/icons';

export default function Browsers(props) {
  return (
    <FullHeightCard>
      <FullHeightTabs
        id="browsers"
        defaultSelectedTabId="devices"
      >
        <Tab
          id="devices"
          panel={<DeviceBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_DEVICE}
            htmlTitle="Devices"
          />
        </Tab>
        <Tab
          id="scripts"
          panel={<ScriptsBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_SCRIPT}
            htmlTitle="Scripts"
          />
        </Tab>
        <Tab
          id="medias"
          panel={<MediasBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_MEDIA}
            htmlTitle="Medias"
          />
        </Tab>
        <Tab
          id="timelines"
          panel={<TimelinesBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon={ICON_TIMELINE}
            htmlTitle="Timelines"
          />
        </Tab>
        <Tab
          id="boards"
          panel={<BoardsBrowser />}
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
          />
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <Menu.Item text="Allo" />
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
