import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import NumberInput from '../../ui/inputs/NumberInput';

export default function ScriptBody({ value, onChange }) {
  const {
    name,
    tempo,
    devices,
    devicesGroups,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'A script name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Tempo"
        helperText="Used when running the script in standalone mode."
      >
        <NumberInput
          name="tempo"
          value={tempo}
          onChange={onChange}
        />
      </InlineFormGroup>
    </>
  );
}
