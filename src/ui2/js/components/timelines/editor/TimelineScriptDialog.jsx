import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import CustomDialog from '../../ui/CustomDialog';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import TimelineScriptDialogBody from './TimelineScriptDialogBody';
import { getSuccessButtonLabel, getDialogTitle } from '../../../lib/dialogHelpers';

export default function TimelineScriptDialog({ opened, mode, value, layers }) {
  return (
    <CustomDialog
      isOpen={opened}
      title={getDialogTitle(mode, 'Script block')}
      icon={ICON_SCRIPT}
    >
      <DialogBody>
        <TimelineScriptDialogBody
          value={value}
          // onChange={changeHandler}
          layers={layers}
        />
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            intent={Intent.SUCCESS}
          >
            {getSuccessButtonLabel(mode)}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
