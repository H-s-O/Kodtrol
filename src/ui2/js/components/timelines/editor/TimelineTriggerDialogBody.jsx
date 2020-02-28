import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import ColorInput from '../../ui/inputs/ColorInput';

export default function TimelineTriggerDialogBody({ value = {}, onChange, layers = [] }) {
  const {
    layer = null,
    name = null,
    inTime = null,
    color = null,
  } = value;

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Layer"
        helperText={!layer ? 'A layer is mandatory.' : undefined}
        intent={!layer ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="layer"
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
        helperText={!name ? 'A trigger name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
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
        helperText={inTime === null ? 'A trigger time is mandatory.' : undefined}
        intent={inTime === null ? Intent.DANGER : undefined}
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
