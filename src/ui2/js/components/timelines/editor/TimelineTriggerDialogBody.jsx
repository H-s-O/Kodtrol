import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import ColorInput from '../../ui/inputs/ColorInput';

export default function TimelineTriggerDialogBody({ value, onChange, validation, layers = [] }) {
  const {
    layer,
    name,
    inTime,
    color,
  } = value;

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Layer"
        helperText={!validation.layer ? 'A layer is mandatory.' : undefined}
        intent={!validation.layer ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="layer"
          value={layer}
          onChange={onChange}
        >
          <option value="null">--</option>
          {layers.map((item, index) => {
            return (
              <option
                key={index}
                value={item.id}>
                {item.name}
              </option>
            )
          })}
        </SelectInput>
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Name"
        helperText={!validation.name ? 'A trigger name is mandatory.' : undefined}
        intent={!validation.name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Time"
        helperText={!validation.inTime ? 'A valid trigger time is mandatory.' : undefined}
        intent={!validation.inTime ? Intent.DANGER : undefined}
      >
        <DurationInput
          name="inTime"
          value={inTime}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Color"
      >
        <ColorInput
          name="color"
          value={color}
          onChange={onChange}
        />
      </InlineFormGroup>
    </>
  );
}
