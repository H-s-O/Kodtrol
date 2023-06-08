import React, { PropsWithChildren } from 'react';
import { Dialog, DialogProps } from '@blueprintjs/core';

type CustomDialogProps = PropsWithChildren<DialogProps & {
  minWidth?: number
  minHeight?: number
}>;

export default function CustomDialog({ children, minWidth = 600, minHeight = 200, ...otherProps }: CustomDialogProps) {
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
};
