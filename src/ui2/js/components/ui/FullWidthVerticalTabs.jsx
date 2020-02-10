import styled from 'styled-components';
import { Tabs, Classes } from '@blueprintjs/core';

const FullWidthVerticalTabs = styled(Tabs).attrs({
  vertical: true,
})`
  & > .${Classes.TAB_PANEL} {
    width: 100%;
  }
`

export default FullWidthVerticalTabs;
