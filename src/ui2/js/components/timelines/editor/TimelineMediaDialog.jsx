import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_MEDIA } from '../../../../../common/js/constants/icons';
import TimelineMediaDialogBody from './TimelineMediaDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineMediaValidator from '../../../../../common/js/validators/timelineMediaValidator';
import mergeDialogBody from '../../../../../common/js/lib/mergeDialogBody';

const defaultValue = {
  media: null,
  layer: null,
  name: null,
  inTime: 0,
  outTime: 0,
  color: null,
  volume: 1,
};

export default function TimelineMediaDialog({ opened, mode, value, layers, medias, duration, onChange, onSuccess, onClose }) {
  const bodyValue = value || defaultValue;
  const bodyValid = timelineMediaValidator(bodyValue, duration);

  const changeHandler = useCallback((value, field) => {
    onChange(mergeDialogBody(bodyValue, value, field));
  }, [onChange, bodyValue]);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Media block')}
      icon={ICON_MEDIA}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineMediaDialogBody
          value={bodyValue}
          onChange={changeHandler}
          validation={bodyValid}
          layers={layers}
          medias={medias}
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
