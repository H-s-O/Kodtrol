import React from 'react';
import { Intent } from "@blueprintjs/core";
import { useSelector } from 'react-redux';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import TagsInput from '../../ui/inputs/TagsInput';
import { useMemo } from 'react';

export default function DeviceBody({ value, onChange }) {
  const {
    name,
    type,
    output,
    groups,
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
        inline
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
        label="Groups"
        helperText={<>Can be used in scripts with <code>hasGroup()</code>.</>}
      >
        <TagsInput
          name="groups"
          value={groups}
          onChange={onChange}
          placeholder="Separate groups with commas"
        />
      </InlineFormGroup>
    </>
  )
}
