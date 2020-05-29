import styled from 'styled-components';
import { Tabs, Classes, Colors } from '@blueprintjs/core';

const FullHeightTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > .${Classes.TAB_PANEL} {
    flex-grow: 1;
    margin-top: 10px;
    overflow: auto;
    position: relative;
    ${({ withBorder }) => withBorder && `
      border: 1px solid ${Colors.DARK_GRAY3};
      border-radius: 2px;
    `}

    & > * {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
`

export default FullHeightTabs;
