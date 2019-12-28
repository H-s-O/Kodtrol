import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

const TagGroup = styled.div`
  display: inline-block;
  
  & > .${Classes.TAG}:not(:last-child) {
    margin-right: 4px;
  }
`
export default TagGroup;
