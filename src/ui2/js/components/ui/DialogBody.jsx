import React from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogBody({ children, ...otherProps }) {
  return (
    <div
      {...otherProps}
      className={Classes.DIALOG_BODY}
    >
      {children}
    </div>
  )
}
