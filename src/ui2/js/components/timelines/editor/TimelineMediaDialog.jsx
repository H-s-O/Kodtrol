import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_MEDIA } from '../../../../../common/js/constants/icons';
import TimelineMediaDialogBody from './TimelineMediaDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import timelineMediaValidator from '../../../../../common/js/validators/timelineMediaValidator';

export default function TimelineMediaDialog({ opened, mode, value, layers, medias, onChange, onSuccess, onClose }) {
  const bodyValid = value && timelineMediaValidator(value);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Media block')}
      icon={ICON_MEDIA}
      onClose={onClose}
    >
      <DialogBody>
        <TimelineMediaDialogBody
          value={value}
          onChange={onChange}
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
