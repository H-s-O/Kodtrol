import React, { useMemo } from 'react';
import { Intent } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import SelectInput from '../ui/inputs/SelectInput';
import TagsInput from '../ui/inputs/TagsInput';
import DmxChannelsInput from './DmxChannelsInput';
import CustomDivider from '../ui/CustomDivider';
import NumberInput from '../ui/inputs/NumberInput';
import { IO_DMX, IO_ILDA, IO_LABELS, IO_ARTNET, IO_MIDI } from '../../../../common/js/constants/io';

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

  const outputs = useSelector((state) => state.outputs);
  const availableOutputs = useMemo(() => {
    if (!type) {
      return []
    }
    return outputs.filter((output) => {
      if (type === IO_DMX) {
        return output.type === IO_DMX || output.type === IO_ARTNET;
      } else if (type === IO_ILDA) {
        return output.type === IO_ILDA;
      } else if (type === IO_MIDI) {
        return output.type === IO_MIDI;
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
          <option value={IO_DMX}>{IO_LABELS[IO_DMX]}</option>
          <option value={IO_ILDA}>{IO_LABELS[IO_ILDA]}</option>
          <option value={IO_MIDI}>{IO_LABELS[IO_MIDI]}</option>
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
      {type === IO_DMX && (
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
      {type === IO_MIDI && (
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
