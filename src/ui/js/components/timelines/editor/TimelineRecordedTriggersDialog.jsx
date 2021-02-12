import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import TimelineRecordedTriggersDialogBody from './TimelineRecordedTriggersDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineRecordedTriggersValidator from '../../../../../common/js/validators/timelineRecordedTriggersValidator';
import mergeDialogBody from '../../../../../common/js/lib/mergeDialogBody';

const defaultValue = {
  triggers: [],
};

export default function TimelineRecordedTriggersDialog({ opened, mode, value, layers, onChange, onSuccess, onClose }) {
  const bodyValue = value || defaultValue;
  const bodyValid = timelineRecordedTriggersValidator(bodyValue);

  const changeHandler = useCallback((value, field) => {
    onChange(mergeDialogBody(bodyValue, value, field));
  }, [onChange, bodyValue]);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'recorded triggers')}
      icon="settings"
      onClose={onClose}
    >
      <DialogBody>
        <TimelineRecordedTriggersDialogBody
          value={bodyValue}
          onChange={changeHandler}
          validation={bodyValid}
          layers={layers}
        />
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            onClick={onClose}
          >
            Cancel
            </Button>
          <Button
            intent={Intent.SUCCESS}
            disabled={!bodyValid.all_fields}
            onClick={onSuccess}
          >
            {getSuccessButtonLabel(mode)}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
