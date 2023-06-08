import React, { PropsWithChildren } from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogFooterActions({ children, ...otherProps }: PropsWithChildren) {
  return (
    <div
      className={Classes.DIALOG_FOOTER_ACTIONS}
      {...otherProps}
    >
      {children}
    </div>
  );
};
