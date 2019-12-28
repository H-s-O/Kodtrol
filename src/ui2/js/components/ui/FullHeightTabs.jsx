import styled from 'styled-components';
import { Tabs, Classes } from '@blueprintjs/core';

const FullHeightTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > .${Classes.TAB_PANEL} {
    height: 100%;
    margin-top: 10px;
  }
`

export default FullHeightTabs;
