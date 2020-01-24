import { FormGroup, Classes } from "@blueprintjs/core";
import styled from 'styled-components';

const InlineFormGroup = styled(FormGroup).attrs({
  inline: true,
})`
  & > .${Classes.LABEL} {
    min-width: ${({ minWidth = 50 }) => minWidth}px;
  }

  & > .${Classes.FORM_CONTENT} {
    width: 100%;
  }
`

export default InlineFormGroup;
