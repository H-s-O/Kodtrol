import React from 'react';

import InlineFormGroup from '../../ui/InlineFormGroup';
import TriggersListInput from './TriggersListInput';

export default function TimelineTriggerDialogBody({ value = {}, onChange, layers = [] }) {
  const {
    triggers = null,
  } = value;

  return (
    <>
      <InlineFormGroup
        label="Triggers"
        helperText="When trigger recording is enabled, pressing an assigned hotkey will insert at the timeline's playback position the corresponding named trigger on the selected layer."
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
