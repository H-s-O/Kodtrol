import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_TRIGGER } from '../../../../../common/js/constants/icons';
import TimelineTriggerDialogBody from './TimelineTriggerDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineTriggerValidator from '../../../../../common/js/validators/timelineTriggerValidator';

export default function TimelineTriggerDialog({ opened, mode, value, layers, onChange, onSuccess, onClose }) {
  const bodyValid = value && timelineTriggerValidator(value);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Trigger')}
      icon={ICON_TRIGGER}
    >
      <DialogBody>
        <TimelineTriggerDialogBody
          value={value}
          onChange={onChange}
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
            disabled={!bodyValid}
            onClick={onSuccess}
          >
            {getSuccessButtonLabel(mode)}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
