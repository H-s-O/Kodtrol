import React from 'react';
import { Tab, Icon } from '@blueprintjs/core';

import DeviceBrowser from './devices/DevicesBrowser';
import FullHeightCard from './ui/FullHeightCard';
import ScriptsBrowser from './scripts/ScriptsBrowser';
import MediasBrowser from './medias/MediasBrowser';
import TimelinesBrowser from './timelines/TimelinesBrowser';
import FullHeightTabs from './ui/FullHeightTabs';

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
            icon="cube"
            htmlTitle="Devices"
          />
        </Tab>
        <Tab
          id="scripts"
          panel={<ScriptsBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon="manually-entered-data"
            htmlTitle="Scripts"
          />
        </Tab>
        <Tab
          id="medias"
          panel={<MediasBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon="music"
            htmlTitle="Medias"
          />
        </Tab>
        <Tab
          id="timelines"
          panel={<TimelinesBrowser />}
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon="film"
            htmlTitle="Timelines"
          />
        </Tab>
        <Tab
          id="dashboards"
        >
          <Icon
            iconSize={Icon.SIZE_LARGE}
            icon="heat-grid"
            htmlTitle="Dashboards"
          />
        </Tab>
      </FullHeightTabs>
    </FullHeightCard>
  )
}
