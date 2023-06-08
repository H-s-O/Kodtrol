import React, { PropsWithChildren } from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogFooter({ children, ...otherProps }: PropsWithChildren) {
  return (
    <div
      className={Classes.DIALOG_FOOTER}
      {...otherProps}
    >
      {children}
    </div>
  );
};
