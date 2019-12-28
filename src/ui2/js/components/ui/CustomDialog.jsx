import React from 'react';
import { Dialog } from "@blueprintjs/core";

export default function CustomDialog({ children, ...otherProps }) {
  return (
    <Dialog
      canOutsideClickClose={false}
      {...otherProps}
    >
      {children}
    </Dialog>
  );
}
