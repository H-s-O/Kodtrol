import React from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogFooter({ children, ...otherProps }) {
  return (
    <div
      {...otherProps}
      className={Classes.DIALOG_FOOTER}
    >
      {children}
    </div>
  )
}
