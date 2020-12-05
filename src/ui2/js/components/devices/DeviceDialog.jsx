import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_DEVICE } from '../../../../common/js/constants/icons';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import DeviceDialogBody from './DeviceDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideDeviceDialogAction, updateDeviceDialogAction } from '../../../../common/js/store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createDeviceAction, saveDeviceAction } from '../../../../common/js/store/actions/devices';
import deviceValidator from '../../../../common/js/validators/deviceValidator';
import { DIALOG_ADD, DIALOG_DUPLICATE, DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import mergeDialogBody from '../../../../common/js/lib/mergeDialogBody';
import { getSuccessButtonLabel } from '../../lib/dialogHelpers';

const defaultValue = {
  name: null,
  type: null,
  output: null,
  tags: [],
};

const getDialogTitle = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate Device';
      break;
    case DIALOG_EDIT:
      return 'Edit Device';
      break;
    case DIALOG_ADD:
    default:
      return 'Add Device';
      break;
  }
}

export default function DeviceDialog() {
  const deviceDialogOpened = useSelector((state) => state.dialogs.deviceDialogOpened);
  const deviceDialogMode = useSelector((state) => state.dialogs.deviceDialogMode);
  const deviceDialogValue = useSelector((state) => state.dialogs.deviceDialogValue);

  const title = getDialogTitle(deviceDialogMode);
  const bodyValue = deviceDialogValue || defaultValue;
  const bodyValid = deviceValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(deviceDialogMode);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideDeviceDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (deviceDialogMode === DIALOG_EDIT) {
      dispatch(saveDeviceAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createDeviceAction(bodyValue));
    }
    dispatch(hideDeviceDialogAction());
  }, [dispatch, bodyValue]);
  const applyHandler = useCallback(() => {
    if (deviceDialogMode === DIALOG_EDIT) {
      dispatch(saveDeviceAction(bodyValue.id, bodyValue));
    }
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateDeviceDialogAction(mergeDialogBody(bodyValue, value, field)));
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={deviceDialogOpened}
      title={title}
      icon={ICON_DEVICE}
      onClose={closeHandler}
      className="device-dialog"
    >
      <DialogBody>
        <DeviceDialogBody
          value={bodyValue}
          onChange={changeHandler}
          validation={bodyValid}
        />
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            onClick={closeHandler}
          >
            Cancel
          </Button>
          {deviceDialogMode === DIALOG_EDIT && (
            <Button
              intent={Intent.PRIMARY}
              disabled={!bodyValid}
              onClick={applyHandler}
            >
              Apply
            </Button>
          )}
          <Button
            intent={Intent.SUCCESS}
            disabled={!bodyValid.all_fields}
            onClick={successHandler}
          >
            {successLabel}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
