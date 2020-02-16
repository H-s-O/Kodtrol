import React, { useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import { useSelector } from 'react-redux';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import NumberInput from '../ui/inputs/NumberInput';
import ScriptDevicesInput from './ScriptDevicesInput';

export default function ScriptDialogBody({ value, onChange }) {
  const {
    name,
    tempo,
    devices,
    devicesGroups,
  } = value;

  const projectDevices = useSelector((state) => state.devices);
  const availableDevices = useMemo(() => {
    return projectDevices.map(({ id, name }) => ({ id, name }));
  }, [projectDevices]);

  return (
    <>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'A script name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Tempo"
        helperText="Used when running the script in standalone mode."
      >
        <NumberInput
          name="tempo"
          min={0}
          max={300}
          value={tempo}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Devices"
      >
        <ScriptDevicesInput
          name="devices"
          value={devices}
          devices={availableDevices}
          onChange={onChange}
        />
      </InlineFormGroup>
    </>
  );
}
