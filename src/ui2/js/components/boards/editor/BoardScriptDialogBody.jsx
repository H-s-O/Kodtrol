import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Intent } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import NumberInput from '../../ui/inputs/NumberInput';
import ColorInput from '../../ui/inputs/ColorInput';
import { ITEM_TRIGGER_MIDI_NOTE, ITEM_LABELS, ITEM_TRIGGER_MIDI_CC, ITEM_TYPE_TRIGGER_ONCE, ITEM_TYPE_TOGGLE } from '../../../../../common/js/constants/items';

export default function BoardScriptDialogBody({ value = {}, onChange, layers = [], scripts = [] }) {
  const {
    script = null,
    layer = null,
    name = null,
    behavior = null,
    trigger = null,
    triggerSource = null,
    leadInTime = null,
    leadOutTime = null,
    color = null,
  } = value;

  const projectScripts = useSelector((state) => state.scripts);
  const availableScripts = useMemo(() => {
    return projectScripts.map(({ id, name }) => ({ id, name }));
  }, [projectScripts]);

  return (
    <>
      <InlineFormGroup
        minWidth="100"
        label="Script"
        helperText={!script ? 'A script is mandatory.' : undefined}
        intent={!script ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="script"
          value={script}
          onChange={onChange}
        >
          <option value="null">--</option>
          {availableScripts.map((item, index) => {
            return (
              <option
                key={index}
                value={item.id}
              >
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
                value={item.id}
              >
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
        label="Behavior"
        helperText={!behavior ? 'A behavior is mandatory.' : undefined}
        intent={!behavior ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="behavior"
          value={behavior}
          onChange={onChange}
        >
          <option value="null">--</option>
          <option value={ITEM_TYPE_TRIGGER_ONCE}>{ITEM_LABELS[ITEM_TYPE_TRIGGER_ONCE]}</option>
          <option value={ITEM_TYPE_TOGGLE}>{ITEM_LABELS[ITEM_TYPE_TOGGLE]}</option>
        </SelectInput>
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="External trigger"
      >
        <SelectInput
          name="trigger"
          value={trigger}
          onChange={onChange}
        >
          <option value="null">--</option>
          <option value={ITEM_TRIGGER_MIDI_NOTE}>{ITEM_LABELS[ITEM_TRIGGER_MIDI_NOTE]}</option>
          <option value={ITEM_TRIGGER_MIDI_CC}>{ITEM_LABELS[ITEM_TRIGGER_MIDI_CC]}</option>
        </SelectInput>
      </InlineFormGroup>
      {trigger && (
        <InlineFormGroup
          minWidth="100"
          label="Trigger source"
          helperText={!triggerSource ? 'An external trigger source is mandatory.' : undefined}
          intent={!triggerSource ? Intent.DANGER : undefined}
        >
          <TextInput
            name="triggerSource"
            value={triggerSource}
            onChange={onChange}
            placeholder="MIDI note name or CC channel"
          />
        </InlineFormGroup>
      )}
      <InlineFormGroup
        minWidth="100"
        label="Lead-in time"
        helperText={<>Duration in milliseconds for which <code>leadInFrame()</code> will run before <code>frame()</code> when the script is activated.</>}
      >
        <NumberInput
          name="leadInTime"
          value={leadInTime}
          placeholder="0"
          min={0}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Lead-out time"
        helperText={<>Duration in milliseconds for which <code>leadOutFrame()</code> will run after the script is deactivated.</>}
      >
        <NumberInput
          name="leadOutTime"
          value={leadOutTime}
          placeholder="0"
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
