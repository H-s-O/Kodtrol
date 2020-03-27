import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_CURVE } from '../../../../../common/js/constants/icons';
import TimelineCurveDialogBody from './TimelineCurveDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineCurveValidator from '../../../../../common/js/validators/timelineCurveValidator';

export default function TimelineCurveDialog({ opened, mode, value, layers, onChange, onSuccess, onClose }) {
  const bodyValid = value && timelineCurveValidator(value);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Curve block')}
      icon={ICON_CURVE}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineCurveDialogBody
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
