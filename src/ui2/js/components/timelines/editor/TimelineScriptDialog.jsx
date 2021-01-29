import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import TimelineScriptDialogBody from './TimelineScriptDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineScriptValidator from '../../../../../common/js/validators/timelineScriptValidator';
import mergeDialogBody from '../../../../../common/js/lib/mergeDialogBody';

const defaultValue = {
  script: null,
  layer: null,
  name: null,
  inTime: 0,
  outTime: 0,
  leadInTime: null,
  leadOutTime: null,
  color: null,
};

export default function TimelineScriptDialog({ opened, mode, value, layers, scripts, duration, onChange, onSuccess, onClose }) {
  const bodyValue = value || defaultValue;
  const bodyValid = timelineScriptValidator(bodyValue, duration);

  const changeHandler = useCallback((value, field) => {
    onChange(mergeDialogBody(bodyValue, value, field));
  }, [onChange, bodyValue]);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Script block')}
      icon={ICON_SCRIPT}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineScriptDialogBody
          value={bodyValue}
          onChange={changeHandler}
          validation={bodyValid}
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
