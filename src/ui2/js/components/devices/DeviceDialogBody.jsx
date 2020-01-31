import React, { useMemo } from 'react';
import { Intent } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import SelectInput from '../ui/inputs/SelectInput';
import TagsInput from '../ui/inputs/TagsInput';
import DmxChannelsInput from '../ui/inputs/DmxChannelsInput';
import CustomDivider from '../ui/CustomDivider';
import NumberInput from '../ui/inputs/NumberInput';

export default function DeviceDialogBody({ value, onChange }) {
  const {
    name,
    type,
    output,
    tags,
    address,
    channels,
    scanSpeed,
  } = value;

  const outputs = useSelector((state) => state.outputs);
  const availableOutputs = useMemo(() => {
    if (!type) {
      return []
    }
    return outputs.filter((output) => {
      if (type === 'dmx') {
        return output.type === 'dmx' || output.type === 'artnet';
      } else if (type === 'ilda') {
        return output.type === 'ilda';
      }
    })
  }, [outputs, type]);

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'A device name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Type"
        helperText={!type ? 'A device type is mandatory.' : undefined}
        intent={!type ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="type"
          value={type}
          onChange={onChange}
        >
          <option value="null">--</option>
          <option value="dmx">DMX</option>
          <option value="ilda">ILDA</option>
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
      {type === 'dmx' && (
        <>
          <InlineFormGroup
            label="Address"
            minWidth={60}
            helperText={!address ? 'A DMX address is mandatory.' : undefined}
            intent={!address ? Intent.DANGER : undefined}
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
      {type === 'ilda' && (
        <>
          <InlineFormGroup
            label="KPPS"
            helperText="Laser scan speed, in thousands of points per second."
          >
            <NumberInput
              name="scanSpeed"
              min={0}
              value={scanSpeed}
              onChange={onChange}
            />
          </InlineFormGroup>
        </>
      )}
    </>
  )
}