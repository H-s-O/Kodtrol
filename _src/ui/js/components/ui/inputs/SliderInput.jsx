import React, { useCallback } from 'react';
import { Slider } from '@blueprintjs/core';

export default function SliderInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback((newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue, name);
    }
  }, [onChange, name]);

  const displayValue = value === null ? '' : value;

  return (
    <Slider
      value={displayValue}
      onChange={changeHandler}
      {...otherProps}
    />
  );
}
