import React, { useCallback } from 'react';
import { TagInput } from '@blueprintjs/core';

export default function TagsInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback((value) => {
    if (typeof onChange === 'function') {
      onChange(value, name);
    }
  }, [onChange, name]);

  const displayValue = !value ? [] : value;

  return (
    <TagInput
      values={displayValue}
      onChange={changeHandler}
      addOnBlur
      {...otherProps}
    />
  );
}
