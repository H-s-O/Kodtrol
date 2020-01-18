import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_DEVICE } from '../../../../../common/js/constants/icons';
import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import DeviceBody from './DeviceBody';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { hideAddDeviceDialogAction, updateAddDeviceDialogAction } from '../../../../../common/js/store/actions/dialogs';
import CustomDialog from '../../ui/CustomDialog';
import { createDeviceAction } from '../../../../../common/js/store/actions/devices';

const defaultValue = {
  name: null,
  type: null,
  output: null,
  tags: [],
};

export default function AddDeviceDialog() {
  const dialogs = useSelector((state) => state.dialogs);
  const { addDeviceDialogOpened, addDeviceDialogValue } = dialogs;

  const bodyValue = addDeviceDialogValue || defaultValue;
  const bodyValid = bodyValue.name && bodyValue.type;

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideAddDeviceDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    dispatch(createDeviceAction(bodyValue));
    dispatch(hideAddDeviceDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateAddDeviceDialogAction({ ...bodyValue, [field]: value }))
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={addDeviceDialogOpened}
      title="Add Device"
      icon={ICON_DEVICE}
      onClose={closeHandler}
    >
      <DialogBody>
        <DeviceBody
          value={bodyValue}
          onChange={changeHandler}
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
            disabled={!bodyValid}
            onClick={successHandler}
          >
            Add
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
