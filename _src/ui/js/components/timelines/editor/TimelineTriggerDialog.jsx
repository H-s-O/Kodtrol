import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_TRIGGER } from '../../../../../common/js/constants/icons';
import TimelineTriggerDialogBody from './TimelineTriggerDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineTriggerValidator from '../../../../../common/js/validators/timelineTriggerValidator';
import mergeDialogBody from '../../../../../common/js/lib/mergeDialogBody';

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
      icon={ICON_TRIGGER}
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
