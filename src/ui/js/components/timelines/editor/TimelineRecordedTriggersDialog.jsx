import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import TimelineRecordedTriggersDialogBody from './TimelineRecordedTriggersDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineScriptValidator from '../../../../../common/js/validators/timelineScriptValidator';

export default function TimelineRecordedTriggersDialog({ opened, mode, value, layers, onChange, onSuccess, onClose }) {
  // const bodyValid = value && timelineScriptValidator(value);
  const bodyValid = true;

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'recorded triggers')}
      icon="settings"
      onClose={onClose}
    >
      <DialogBody>
        <TimelineRecordedTriggersDialogBody
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
