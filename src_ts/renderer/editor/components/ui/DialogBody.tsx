import React, { PropsWithChildren } from 'react';
import { Classes } from '@blueprintjs/core';

const DialogBody = ({ children, ...otherProps }: PropsWithChildren) => {
  return (
    <div
      className={Classes.DIALOG_BODY}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default DialogBody;
