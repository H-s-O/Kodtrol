import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import TimelineTriggerDialogBody from './TimelineTriggerDialogBody';
import { timelineTriggerValidator } from '../../../validators/timelineValidators';
import { getDialogTitle, getSuccessButtonLabel, mergeDialogBody } from '../../../lib/helpers';
import { KodtrolIconType } from '../../../constants';

const defaultValue = {
  layer: null,
  name: null,
  inTime: 0,
  color: null,
};

export default function TimelineTriggerDialog({ opened, mode, value, layers, duration, onChange, onSuccess, onClose }) {
  const bodyValue = value || defaultValue;
  const bodyValid = timelineTriggerValidator(bodyValue, duration);

  const changeHandler = useCallback((value, field) => {
    onChange(mergeDialogBody(bodyValue, value, field));
  }, [onChange, bodyValue]);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Trigger')}
      icon={KodtrolIconType.TRIGGER}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineTriggerDialogBody
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
            Close
            </Button>
          <Button
            intent={Intent.SUCCESS}
            disabled={!bodyValid.__all_fields}
            onClick={onSuccess}
          >
            {getSuccessButtonLabel(mode)}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
