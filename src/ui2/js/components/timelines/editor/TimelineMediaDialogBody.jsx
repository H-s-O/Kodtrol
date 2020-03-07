import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import NumberInput from '../../ui/inputs/NumberInput';
import ColorInput from '../../ui/inputs/ColorInput';

export default function TimelineScriptDialogBody({ value = {}, onChange, layers = [], medias = [] }) {
  const {
    media = null,
    layer = null,
    name = null,
    inTime = null,
    outTime = null,
    color = null,
    volume = 1,
  } = value;

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Script"
        helperText={!media ? 'A media is mandatory.' : undefined}
        intent={!media ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="media"
          value={media}
          onChange={onChange}
        >
          <option value="null">--</option>
          {medias.map((item, index) => {
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
        helperText="If not set, Kodtrol will use the associated media's name."
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
        label="Volume"
      >
        <NumberInput
          name="volume"
          value={volume}
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
