import React, { useCallback } from 'react';
import { TimePicker, TimePrecision } from '@blueprintjs/datetime';

const emptyDate = new Date(1970, 0, 1, 0, 0, 0, 0);
const timeOffset = emptyDate.getTimezoneOffset() * 60 * 1000;

export default function DurationInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback((newTime) => {
    if (typeof onChange === 'function') {
      const finalValue = newTime.getTime() - timeOffset;
      onChange(finalValue, name);
    }
  }, [onChange, name]);

  const displayValue = value === null ? emptyDate : new Date(1970, 0, 1, 0, 0, 0, value);

  return (
    <TimePicker
      selectAllOnFocus
      precision={TimePrecision.MILLISECOND}
      value={displayValue}
      onChange={changeHandler}
      {...otherProps}
    />
  )
}
