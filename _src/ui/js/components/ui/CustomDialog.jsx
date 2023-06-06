import React from 'react';
import { Dialog } from '@blueprintjs/core';

export default function CustomDialog({ children, minWidth = 600, minHeight = 200, ...otherProps }) {
  return (
    <Dialog
      style={{
        minWidth,
        minHeight,
      }}
      canOutsideClickClose={false}
      {...otherProps}
    >
      {children}
    </Dialog>
  );
}
