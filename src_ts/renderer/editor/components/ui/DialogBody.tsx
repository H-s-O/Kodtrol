import React, { PropsWithChildren } from 'react';
import { Classes } from '@blueprintjs/core';

export default function DialogBody({ children, ...otherProps }: PropsWithChildren) {
  return (
    <div
      className={Classes.DIALOG_BODY}
      {...otherProps}
    >
      {children}
    </div>
  );
};
