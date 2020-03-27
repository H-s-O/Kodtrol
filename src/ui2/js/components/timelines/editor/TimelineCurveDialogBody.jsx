import React from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import NumberInput from '../../ui/inputs/NumberInput';
import ColorInput from '../../ui/inputs/ColorInput';

export default function TimelineCurveDialogBody({ value = {}, onChange, layers = [] }) {
  const {
    layer = null,
    name = null,
    inTime = null,
    outTime = null,
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
        helperText={!name ? 'A curve name is mandatory.' : undefined}
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
        label="In time"
        helperText={inTime === null ? 'An in time is mandatory.' : undefined}
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
        label="Out time"
        helperText={outTime === null ? 'A out time is mandatory.' : undefined}
        intent={outTime === null ? Intent.DANGER : undefined}
      >
        <DurationInput
          name="outTime"
          value={outTime}
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
