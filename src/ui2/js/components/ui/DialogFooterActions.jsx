import React from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogFooterActions({ children, ...otherProps }) {
  return (
    <div
      className={Classes.DIALOG_FOOTER_ACTIONS}
      {...otherProps}
    >
      {children}
    </div>
  );
}
