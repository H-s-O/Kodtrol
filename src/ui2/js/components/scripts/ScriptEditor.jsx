import React, { Component } from 'react';
import { Tab, Button } from '@blueprintjs/core';

import FullHeightCard from '../ui/FullHeightCard';
import CodeEditor from './CodeEditor';
import FullHeightTabs from '../ui/FullHeightTabs';

export default class ScriptEditor extends Component {
  render = () => {
    return (
      <FullHeightCard>
        <FullHeightTabs>
          <Tab
            id="ssakdasj1"
            panel={<CodeEditor />}
          >
            My script1 <Button small minimal icon="small-cross" />
          </Tab>
          <Tab
            id="sadasdasfff"
            panel={<CodeEditor />}
          >
            My script2 <Button small minimal icon="small-cross" />
          </Tab>
        </FullHeightTabs>
      </FullHeightCard>
    )
  }
}

