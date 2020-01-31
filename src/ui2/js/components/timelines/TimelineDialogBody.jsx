import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import DurationInput from '../ui/inputs/DurationInput';
import NumberInput from '../ui/inputs/NumberInput';

export default function TimelineDialogBody({ value, onChange }) {
  const {
    name,
    duration,
    tempo,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'A timeline name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Duration"
        helperText={!duration ? 'A timeline duration is mandatory.' : undefined}
        intent={!duration ? Intent.DANGER : undefined}
      >
        <DurationInput
          name="duration"
          value={duration}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Tempo"
        helperText={<>If not set, <code>beat()</code> script hooks won't be executed.</>}
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
