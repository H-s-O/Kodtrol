import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import DialogBody from '../../ui/DialogBody';
import DialogFooter from '../../ui/DialogFooter';
import ScriptBody from './ScriptBody';
import DialogFooterActions from '../../ui/DialogFooterActions';
import { hideAddScriptDialogAction, updateAddScriptDialogAction } from '../../../../../common/js/store/actions/dialogs';
import CustomDialog from '../../ui/CustomDialog';
import { createScriptAction } from '../../../../../common/js/store/actions/scripts';
import scriptValidator from '../../../../../common/js/validators/scriptValidator';

const defaultValue = {
  name: null,
  tempo: null,
  devices: [],
  devicesGroups: [],
};

export default function AddScriptDialog() {
  const addScriptDialogOpened = useSelector((state) => state.dialogs.addScriptDialogOpened);
  const addScriptDialogValue = useSelector((state) => state.dialogs.addScriptDialogValue);

  const bodyValue = addScriptDialogValue || defaultValue;
  const bodyValid = scriptValidator(bodyValue);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideAddScriptDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    dispatch(createScriptAction(bodyValue));
    dispatch(hideAddScriptDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateAddScriptDialogAction({ ...bodyValue, [field]: value }))
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={addScriptDialogOpened}
      title="Add Script"
      icon={ICON_SCRIPT}
      onClose={closeHandler}
    >
      <DialogBody>
        <ScriptBody
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
