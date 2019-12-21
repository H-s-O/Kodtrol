import styled from 'styled-components';
import { Tabs } from '@blueprintjs/core';

const FullHeightTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > .bp3-tab-panel {
    height: 100%;
    margin-top: 10px;
  }
`

export default FullHeightTabs;
