import React, { useCallback } from 'react';
import { HTMLSelect } from '@blueprintjs/core';

export default function SelectInput({ value, onChange, ...otherProps }) {
  const changeHandler = useCallback(({ target: { value, name } }) => {
    if (typeof onChange === 'function') {
      const finalValue = value === 'null' || value === '' ? null : value;
      onChange(finalValue, name)
    }
  }, [onChange])

  const displayValue = value === null ? '' : value;

  return (
    <HTMLSelect
      value={displayValue}
      onChange={changeHandler}
      {...otherProps}
    />
  );
}
