import React, { useMemo } from 'react';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import SelectInput from '../ui/inputs/SelectInput';
import TagsInput from '../ui/inputs/TagsInput';
import DmxChannelsInput from './DmxChannelsInput';
import CustomDivider from '../ui/CustomDivider';
import NumberInput from '../ui/inputs/NumberInput';
import { useKodtrolSelector } from '../../lib/hooks';
import { IOType, IO_LABELS } from '../../../../common/constants';

export default function DeviceDialogBody({ value, onChange, validation }) {
  const {
    name,
    type,
    output,
    tags,
    address,
    channel,
    channels,
  } = value;

  const outputs = useKodtrolSelector((state) => state.outputs);
  const availableOutputs = useMemo(() => {
    if (!type) {
      return []
    }
    return outputs.filter((output) => {
      if (type === IOType.DMX) {
        return output.type === IOType.DMX || output.type === IOType.ARTNET;
      } else if (type === IOType.ILDA) {
        return output.type === IOType.ILDA;
      } else if (type === IOType.MIDI) {
        return output.type === IOType.MIDI;
      }
    })
  }, [outputs, type]);

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!validation.name ? 'A device name is mandatory.' : undefined}
        intent={!validation.name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Type"
        helperText={!validation.type ? 'A device type is mandatory.' : undefined}
        intent={!validation.type ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="type"
          value={type}
          onChange={onChange}
        >
          <option value="null">--</option>
          <option value={IOType.DMX}>{IO_LABELS[IOType.DMX]}</option>
          <option value={IOType.ILDA}>{IO_LABELS[IOType.ILDA]}</option>
          <option value={IOType.MIDI}>{IO_LABELS[IOType.MIDI]}</option>
        </SelectInput>
      </InlineFormGroup>
      <InlineFormGroup
        label="Output"
        helperText={!output ? 'If not set, the device can still be used in scripts, but it will not send data.' : undefined}
        intent={!output ? Intent.WARNING : undefined}
      >
        <SelectInput
          name="output"
          value={output}
          onChange={onChange}
          disabled={!type}
        >
          <option value="null">--</option>
          {availableOutputs.map(({ id, name }) => (
            <option
              key={id}
              value={id}
            >
              {name}
            </option>
          ))}
        </SelectInput>
      </InlineFormGroup>
      <InlineFormGroup
        label="Tags"
        helperText={<>Can be used in scripts with <code>hasTag()</code>.</>}
      >
        <TagsInput
          name="tags"
          value={tags}
          onChange={onChange}
          placeholder="Separate tags with commas"
        />
      </InlineFormGroup>
      {type && (
        <CustomDivider />
      )}
      {type === IOType.DMX && (
        <>
          <InlineFormGroup
            label="Address"
            minWidth={60}
            helperText={!validation.address ? 'A DMX address is mandatory.' : undefined}
            intent={!validation.address ? Intent.DANGER : undefined}
          >
            <NumberInput
              name="address"
              min={1}
              max={512}
              value={address}
              onChange={onChange}
            />
          </InlineFormGroup>
          <InlineFormGroup
            label="Channels"
            minWidth={60}
          >
            <DmxChannelsInput
              name="channels"
              value={channels}
              onChange={onChange}
            />
          </InlineFormGroup>
        </>
      )}
      {type === IOType.MIDI && (
        <>
          <InlineFormGroup
            label="Channel"
            minWidth={60}
            helperText={!validation.channel ? 'A MIDI device channel is mandatory.' : undefined}
            intent={!validation.channel ? Intent.DANGER : undefined}
          >
            <NumberInput
              name="channel"
              min={1}
              max={16}
              value={channel}
              onChange={onChange}
            />
          </InlineFormGroup>
        </>
      )}
    </>
  )
}
