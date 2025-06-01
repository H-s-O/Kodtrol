import React from 'react';
import { Classes } from '@blueprintjs/core';

export default function ({ label, helperText = null }) {
  return (
    <>
      <span>{label}</span>
      {helperText && (<div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{helperText}</div>)}
    </>
  );
}
