import React, { useCallback } from 'react';
import { NumericInput } from '@blueprintjs/core';

export default function NumberInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback((valueAsNumber) => {
    if (typeof onChange === 'function') {
      onChange(valueAsNumber, name)
    }
  }, [onChange, name]);

  const displayValue = value === null ? '' : value;

  return (
    <NumericInput
      asyncControl
      value={displayValue}
      onValueChange={changeHandler}
      clampValueOnBlur
      {...otherProps}
    />
  )
}
