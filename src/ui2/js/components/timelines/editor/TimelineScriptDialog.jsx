import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import TimelineScriptDialogBody from './TimelineScriptDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineScriptValidator from '../../../../../common/js/validators/timelineScriptValidator';

export default function TimelineScriptDialog({ opened, mode, value, layers, scripts, onChange, onSuccess, onClose }) {
  const bodyValid = value && timelineScriptValidator(value);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Script block')}
      icon={ICON_SCRIPT}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineScriptDialogBody
          value={value}
          onChange={onChange}
          layers={layers}
          scripts={scripts}
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
