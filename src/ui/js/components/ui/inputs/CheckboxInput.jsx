import React, { useCallback } from 'react';
import { Checkbox } from '@blueprintjs/core';

export default function CheckboxInput({ value, onChange, ...otherProps }) {
  const changeHandler = useCallback(({ target: { name, checked } }) => {
    if (typeof onChange === 'function') {
      onChange(checked, name);
    }
  })

  const displayValue = !value ? false : value;

  return (
    <Checkbox
      checked={displayValue}
      onChange={changeHandler}
      {...otherProps}
    />
  );
}
