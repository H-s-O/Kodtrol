import React, { useCallback } from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import DurationInput from '../../ui/inputs/DurationInput';
import ColorInput from '../../ui/inputs/ColorInput';
import SliderInput from '../../ui/inputs/SliderInput';
import percentString from '../../../lib/percentString';

export default function TimelineMediaDialogBody({ value, onChange, validation, layers = [], medias = [] }) {
  const {
    media,
    layer,
    name,
    inTime,
    outTime,
    color,
    volume,
  } = value;

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Media"
        helperText={!validation.media ? 'A media is mandatory.' : undefined}
        intent={!validation.media ? Intent.DANGER : undefined}
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
        label="Volume"
      >
        <SliderInput
          name="volume"
          min={0}
          max={1}
          stepSize={0.01}
          labelRenderer={percentString}
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
