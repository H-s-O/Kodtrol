import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { timelineCurveValidator } from '../../../validators/timelineValidators';
import { getDialogTitle, getSuccessButtonLabel, mergeDialogBody } from '../../../lib/helpers';
import { KodtrolIconType } from '../../../constants';
import TimelineCurveDialogBody from './TimelineCurveDialogBody';

const defaultValue = {
  layer: null,
  name: null,
  inTime: 0,
  outTime: 0,
  color: null,
};

export default function TimelineCurveDialog({ opened, mode, value, layers, duration, onChange, onSuccess, onClose }) {
  const bodyValue = value || defaultValue;
  const bodyValid = timelineCurveValidator(bodyValue, duration);

  const changeHandler = useCallback((value, field) => {
    onChange(mergeDialogBody(bodyValue, value, field));
  }, [onChange, bodyValue]);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Curve block')}
      icon={KodtrolIconType.CURVE}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineCurveDialogBody
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
