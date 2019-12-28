import React from 'react';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import { ICON_DEVICE } from '../../../../../common/js/constants/icons';
import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import DeviceBody from './DeviceBody';
import DialogFooterActions from '../../ui/DialogFooterActions';

export default function AddDeviceDialog() {
  return (
    <Dialog
      isOpen
      title="Add Device"
      icon={ICON_DEVICE}
    >
      <DialogBody>
        <DeviceBody />
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
          >
            Cancel
          </Button>
          <Button
            intent={Intent.SUCCESS}
            disabled
          >
            Add
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </Dialog>
  );
}
