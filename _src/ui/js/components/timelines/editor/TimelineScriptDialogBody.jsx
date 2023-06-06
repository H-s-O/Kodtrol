import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import NumberInput from '../../ui/inputs/NumberInput';
import ColorInput from '../../ui/inputs/ColorInput';

export default function TimelineScriptDialogBody({ value, onChange, validation, layers = [], scripts = [] }) {
  const {
    script,
    layer,
    name,
    inTime,
    outTime,
    leadInTime,
    leadOutTime,
    color,
  } = value;

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Script"
        helperText={!validation.script ? 'A script is mandatory.' : undefined}
        intent={!validation.script ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="script"
          value={script}
          onChange={onChange}
        >
          <option value="null">--</option>
          {scripts.map((item, index) => {
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
        helperText="If not set, Kodtrol will use the associated script's name."
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
        helperText={!validation.inTime ? 'A valid in time is mandatory.' : undefined}
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
        label="Lead-in time"
        helperText={<>Duration in milliseconds for which <code>leadInFrame()</code> will run before <b>In time</b>.</>}
      >
        <NumberInput
          name="leadInTime"
          value={leadInTime}
          placeholder="500"
          min={0}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Out time"
        helperText={!validation.outTime ? 'A valid out time is mandatory.' : undefined}
        intent={!validation.outTime ? Intent.DANGER : undefined}
      >
        <DurationInput
          name="outTime"
          value={outTime}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Lead-out time"
        helperText={<>Duration in milliseconds for which <code>leadOutFrame()</code> will run after <b>Out time</b>.</>}
      >
        <NumberInput
          name="leadOutTime"
          value={leadOutTime}
          placeholder="500"
          min={0}
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
