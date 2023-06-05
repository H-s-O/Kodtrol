import React from 'react';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TriggersListInput from './TriggersListInput';

export default function TimelineTriggerDialogBody({ value, onChange, validation, layers = [] }) {
  const {
    triggers,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Triggers"
        helperText="When trigger recording is active, pressing a trigger hotkey will insert at the timeline's playback position and on the configured layer the corresponding named trigger."
      >
        <TriggersListInput
          name="triggers"
          value={triggers}
          onChange={onChange}
          layers={layers}
        />
      </InlineFormGroup>
    </>
  );
}
