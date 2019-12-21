import React from 'react';
import { Tabs, Tab, Icon } from '@blueprintjs/core';

import DeviceBrowser from './devices/DeviceBrowser';

export default function Browsers(props) {
  return (
    <Tabs
      id="browsers"
    >
      <Tab
        panel={<DeviceBrowser />}
      >
        <Icon
          icon="music"
        />
      </Tab>
      <Tab>
        <Icon
          icon="music"
        />
      </Tab>
      <Tab>
        <Icon
          icon="music"
        />
      </Tab>
      <Tab>
        <Icon
          icon="music"
        />
      </Tab>
      <Tab>
        <Icon
          icon="music"
        />
      </Tab>
    </Tabs>
  )
}
