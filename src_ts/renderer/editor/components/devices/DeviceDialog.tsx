import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import DeviceDialogBody from './DeviceDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideDeviceDialogAction, updateDeviceDialogAction } from '../../store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createDeviceAction, saveDeviceAction } from '../../store/actions/devices';
import { KodtrolDialogType, KodtrolIconType } from '../../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { getSuccessButtonLabel, mergeDialogBody } from '../../lib/helpers';
import { deviceValidator } from '../../validators/deviceValidators';

const defaultValue = {
  name: null,
  type: null,
  output: null,
  tags: [],
};

const getDialogTitle = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate Device';
      break;
    case KodtrolDialogType.EDIT:
      return 'Edit Device Properties';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add Device';
      break;
  }
}

export default function DeviceDialog() {
  const deviceDialogOpened = useKodtrolSelector((state) => state.dialogs.deviceDialogOpened);
  const deviceDialogMode = useKodtrolSelector((state) => state.dialogs.deviceDialogMode);
  const deviceDialogValue = useKodtrolSelector((state) => state.dialogs.deviceDialogValue);

  const title = getDialogTitle(deviceDialogMode);
  const bodyValue = deviceDialogValue || defaultValue;
  const bodyValid = deviceValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(deviceDialogMode);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideDeviceDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (deviceDialogMode === KodtrolDialogType.EDIT) {
      dispatch(saveDeviceAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createDeviceAction(bodyValue));
    }
    dispatch(hideDeviceDialogAction());
  }, [dispatch, bodyValue]);
  const applyHandler = useCallback(() => {
    if (deviceDialogMode === KodtrolDialogType.EDIT) {
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
      icon={KodtrolIconType.DEVICE}
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
          {deviceDialogMode === KodtrolDialogType.EDIT && (
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
            disabled={!bodyValid.__all_fields}
            onClick={successHandler}
          >
            {successLabel}
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
}
