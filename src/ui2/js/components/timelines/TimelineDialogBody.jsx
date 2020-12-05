import React from 'react';
import { Intent, ControlGroup, Button } from '@blueprintjs/core';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import DurationInput from '../ui/inputs/DurationInput';
import NumberInput from '../ui/inputs/NumberInput';

export default function TimelineDialogBody({ value, onChange, validation }) {
  const {
    name,
    duration,
    tempo,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!validation.name ? 'A timeline name is mandatory.' : undefined}
        intent={!validation.name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Duration"
        helperText={!validation.duration ? 'A timeline duration is mandatory.' : undefined}
        intent={!validation.duration ? Intent.DANGER : undefined}
      >
        <ControlGroup>
          <DurationInput
            name="duration"
            value={duration}
            onChange={onChange}
          />
          <Button
            icon="duplicate"
            title="Copy duration"
          />
        </ControlGroup>
      </InlineFormGroup>
      <InlineFormGroup
        label="Tempo"
        helperText={<>If not set, <code>beat()</code> script hooks won't be executed in this timeline.</>}
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
