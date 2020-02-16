import React from 'react';
import Select from '@blueprintjs/select';
import { Button } from '@blueprintjs/core';

export default function SelectSearchInput({ value, name, onChange, label, ...otherProps }) {

  return (
    <Select
      {...otherProps}
    >
      <Button
        fill
        small
      >
        {label}
      </Button>
    </Select>
  );
}
