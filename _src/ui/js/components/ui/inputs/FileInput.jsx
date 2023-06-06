import React, { useCallback } from 'react';
import { FileInput as FInput } from '@blueprintjs/core';

export default function FileInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback(({ target: { files } }) => {
    if (typeof onChange === 'function') {
      const finalValue = files && files.length ? files[0].path : null;
      onChange(finalValue, name);
    }
  }, [onChange, name]);

  const displayValue = !value ? '<none>' : value;

  return (
    <FInput
      text={displayValue}
      onInputChange={changeHandler}
      hasSelection={!!value}
      {...otherProps}
    />
  );
}
