import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_DEVICE } from '../../../../../common/js/constants/icons';
import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import DeviceBody from './DeviceBody';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { hideEditDeviceDialogAction, updateEditDeviceDialogAction } from '../../../../../common/js/store/actions/dialogs';
import CustomDialog from '../../ui/CustomDialog';
import { saveDeviceAction } from '../../../../../common/js/store/actions/devices';
import deviceValidator from '../../../../../common/js/validators/deviceValidator';

const defaultValue = {
  name: null,
  type: null,
  output: null,
  tags: [],
};

export default function EditDeviceDialog() {
  const editDeviceDialogOpened = useSelector((state) => state.dialogs.editDeviceDialogOpened);
  const editDeviceDialogValue = useSelector((state) => state.dialogs.editDeviceDialogValue);

  const bodyValue = editDeviceDialogValue || defaultValue;
  const bodyValid = deviceValidator(bodyValue);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideEditDeviceDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    dispatch(saveDeviceAction(bodyValue.id, bodyValue));
    dispatch(hideEditDeviceDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateEditDeviceDialogAction({ ...bodyValue, [field]: value }))
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={editDeviceDialogOpened}
      title="Edit Device"
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
            Save
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
