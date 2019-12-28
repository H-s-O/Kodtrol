import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_DEVICE } from '../../../../../common/js/constants/icons';
import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import DeviceBody from './DeviceBody';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { hideAddDeviceDialogAction } from '../../../../../common/js/store/actions/dialogs';
import CustomDialog from '../../ui/CustomDialog';

export default function AddDeviceDialog() {
  const dialogs = useSelector((state) => state.dialogs);
  const { addDeviceDialogOpened, addDeviceDialogValue } = dialogs;

  const dispatch = useDispatch();

  const closeHandler = useCallback(() => {
    dispatch(hideAddDeviceDialogAction());
  }, [dispatch]);

  return (
    <CustomDialog
      isOpen={addDeviceDialogOpened}
      title="Add Device"
      icon={ICON_DEVICE}
      onClose={closeHandler}
    >
      <DialogBody>
        <DeviceBody
          value={undefined}
        />
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            onClick={closeHandler}
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
    </CustomDialog>
  );
}
