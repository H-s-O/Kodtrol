import React from 'react';
import { Intent, Radio } from '@blueprintjs/core';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import NumberInput from '../../ui/inputs/NumberInput';
import ColorInput from '../../ui/inputs/ColorInput';
import RadioInput from '../../ui/inputs/RadioInput';
import {
  ITEM_TRIGGER_MIDI_NOTE,
  ITEM_LABELS,
  ITEM_TRIGGER_MIDI_CC,
  ITEM_BEHAVIOR_TRIGGER_ONCE,
  ITEM_BEHAVIOR_TOGGLE,
  ITEM_TRIGGER_OSC_ADR_ARG,
  ITEM_SWITCH_MODE_JUMP,
  ITEM_SWITCH_MODE_MIRROR,
} from '../../../../../common/js/constants/items';
import RadioItemLabel from '../../ui/RadioItemLabel';
import ScriptDevicesInput from '../../scripts/ScriptDevicesInput';

export default function BoardScriptDialogBody({ value, onChange, validation, layers = [], scripts = [], devices = [] }) {
  const {
    script,
    layer,
    name,
    behavior,
    trigger,
    triggerSource,
    switchMode,
    leadInTime,
    leadOutTime,
    devicesOverride,
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
        helperText={!validation.behavior ? 'A behavior is mandatory.' : undefined}
        intent={!validation.behavior ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="behavior"
          value={behavior}
          onChange={onChange}
        >
          <option value="null">--</option>
          <option value={ITEM_BEHAVIOR_TRIGGER_ONCE}>{ITEM_LABELS[ITEM_BEHAVIOR_TRIGGER_ONCE]}</option>
          <option value={ITEM_BEHAVIOR_TOGGLE}>{ITEM_LABELS[ITEM_BEHAVIOR_TOGGLE]}</option>
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
          <option value="null">&lt;none&gt;</option>
          <option value={ITEM_TRIGGER_MIDI_NOTE}>{ITEM_LABELS[ITEM_TRIGGER_MIDI_NOTE]}</option>
          <option value={ITEM_TRIGGER_MIDI_CC}>{ITEM_LABELS[ITEM_TRIGGER_MIDI_CC]}</option>
          <option value={ITEM_TRIGGER_OSC_ADR_ARG}>{ITEM_LABELS[ITEM_TRIGGER_OSC_ADR_ARG]}</option>
        </SelectInput>
      </InlineFormGroup>
      {trigger && (
        <InlineFormGroup
          minWidth="100"
          label="Trigger source"
          helperText={!validation.triggerSource ? 'An external trigger source is mandatory.' : undefined}
          intent={!validation.triggerSource ? Intent.DANGER : undefined}
        >
          <TextInput
            name="triggerSource"
            value={triggerSource}
            onChange={onChange}
            placeholder={trigger === ITEM_TRIGGER_MIDI_NOTE ? 'MIDI note name' : trigger === ITEM_TRIGGER_MIDI_CC ? 'MIDI CC channel' : 'OSC address'}
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
        disabled={!leadInTime || !leadOutTime}
        minWidth="100"
        label="Switch mode"
        helperText={!validation.switchMode ? 'A switch mode is mandatory when both lead-in and lead-out times are specified.' : undefined}
        intent={!validation.switchMode ? Intent.DANGER : undefined}
      >
        <RadioInput
          name="switchMode"
          disabled={!leadInTime || !leadOutTime}
          value={switchMode}
          onChange={onChange}
        >
          <Radio value={ITEM_SWITCH_MODE_JUMP} labelElement={<RadioItemLabel label='Jump' helperText='Jump to the beginning of lead-in and lead-out durations' />} />
          <Radio value={ITEM_SWITCH_MODE_MIRROR} labelElement={<RadioItemLabel label='Mirror' helperText='Mirror the remaining progress from lead-in to the lead-out progress and vice-versa' />} />
        </RadioInput>
      </InlineFormGroup>
      <InlineFormGroup
        minWidth="100"
        label="Devices"
        helperText="If set, this device list will override the associated script's original devices list."
      >
        <ScriptDevicesInput
          name="devicesOverride"
          value={devicesOverride}
          devices={devices}
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
