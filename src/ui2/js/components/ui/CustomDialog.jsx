import React from 'react';
import { Dialog } from "@blueprintjs/core";

export default function CustomDialog({ children, ...otherProps }) {
  return (
    <Dialog
      style={{
        minWidth: 600,
      }}
      canOutsideClickClose={false}
      {...otherProps}
    >
      {children}
    </Dialog>
  );
}
