import { FormGroup, Classes } from "@blueprintjs/core";
import styled from 'styled-components';

const InlineFormGroup = styled(FormGroup).attrs({
  inline: true,
})`
  & > .${Classes.LABEL} {
    min-width: ${({ minWidth = 50 }) => minWidth}px;
  }
`

export default InlineFormGroup;
