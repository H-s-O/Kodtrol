import React from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogBody({ children, ...otherProps }) {
  return (
    <div
      className={Classes.DIALOG_BODY}
      {...otherProps}
    >
      {children}
    </div>
  );
}
