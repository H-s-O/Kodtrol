import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import BoardScriptDialogBody from './BoardScriptDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';
import boardScriptValidator from '../../../../../common/js/validators/boardScriptValidator';

export default function BoardScriptDialog({ opened, mode, value, layers, scripts, onChange, onSuccess, onClose }) {
  const bodyValid = value && boardScriptValidator(value);

  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Script block')}
      icon={ICON_SCRIPT}
      onClose={onClose}
    >
      <DialogBody>
        <BoardScriptDialogBody
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
