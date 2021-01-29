import React, { useCallback } from 'react';
import { InputGroup } from "@blueprintjs/core";

export default function TextInput({ value, onChange, ...otherProps }) {
  const changeHandler = useCallback(({ target: { value, name } }) => {
    if (typeof onChange === 'function') {
      const finalValue = value === '' ? null : value;
      onChange(finalValue, name);
    }
  }, [onChange]);

  const displayValue = value === null ? '' : value;

  return (
    <InputGroup
      asyncControl
      value={displayValue}
      onChange={changeHandler}
      {...otherProps}
    />
  );
}
