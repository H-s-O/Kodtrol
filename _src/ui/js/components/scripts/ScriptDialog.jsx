import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_SCRIPT } from '../../../../common/js/constants/icons';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import ScriptDialogBody from './ScriptDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideScriptDialogAction, updateScriptDialogAction } from '../../../../common/js/store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createScriptAction, saveScriptAction } from '../../../../common/js/store/actions/scripts';
import scriptValidator from '../../../../common/js/validators/scriptValidator';
import { DIALOG_ADD, DIALOG_DUPLICATE, DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import mergeDialogBody from '../../../../common/js/lib/mergeDialogBody';
import { getSuccessButtonLabel } from '../../lib/dialogHelpers';

const defaultValue = {
  name: null,
  tempo: null,
  devices: [],
  devicesGroups: [],
};

const getDialogTitle = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate Script';
      break;
    case DIALOG_EDIT:
      return 'Edit Script';
      break;
    case DIALOG_ADD:
    default:
      return 'Add Script';
      break;
  }
}

export default function ScriptDialog() {
  const scriptDialogOpened = useSelector((state) => state.dialogs.scriptDialogOpened);
  const scriptDialogMode = useSelector((state) => state.dialogs.scriptDialogMode);
  const scriptDialogValue = useSelector((state) => state.dialogs.scriptDialogValue);

  const title = getDialogTitle(scriptDialogMode);
  const bodyValue = scriptDialogValue || defaultValue;
  const bodyValid = scriptValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(scriptDialogMode);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideScriptDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (scriptDialogMode === DIALOG_EDIT) {
      dispatch(saveScriptAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createScriptAction(bodyValue));
    }
    dispatch(hideScriptDialogAction());
  }, [dispatch, bodyValue]);
  const applyHandler = useCallback(() => {
    if (scriptDialogMode === DIALOG_EDIT) {
      dispatch(saveScriptAction(bodyValue.id, bodyValue));
    }
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateScriptDialogAction(mergeDialogBody(bodyValue, value, field)));
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={scriptDialogOpened}
      title={title}
      icon={ICON_SCRIPT}
      onClose={closeHandler}
      className="script-dialog"
    >
      <DialogBody>
        <ScriptDialogBody
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
          {scriptDialogMode === DIALOG_EDIT && (
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
