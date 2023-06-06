import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import NumberInput from '../ui/inputs/NumberInput';

export default function BoardDialogBody({ value, onChange, validation }) {
  const {
    name,
    tempo,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!validation.name ? 'A board name is mandatory.' : undefined}
        intent={!validation.name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Tempo"
        helperText={<>If not set, <code>beat()</code> script hooks won't be executed in this board.</>}
      >
        <NumberInput
          name="tempo"
          min={0}
          max={300}
          value={tempo}
          onChange={onChange}
        />
      </InlineFormGroup>
    </>
  );
}
