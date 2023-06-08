import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import ScriptDialogBody from './ScriptDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideScriptDialogAction, updateScriptDialogAction } from '../../store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createScriptAction, saveScriptAction } from '../../store/actions/scripts';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { KodtrolDialogType, KodtrolIconType } from '../../constants';
import { getSuccessButtonLabel, mergeDialogBody } from '../../lib/helpers';
import { scriptValidator } from '../../validators/scriptValidators';

const defaultValue = {
  name: null,
  tempo: null,
  devices: [],
  devicesGroups: [],
};

const getDialogTitle = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate Script';
      break;
    case KodtrolDialogType.EDIT:
      return 'Edit Script Properties';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add Script';
      break;
  }
}

export default function ScriptDialog() {
  const scriptDialogOpened = useKodtrolSelector((state) => state.dialogs.scriptDialogOpened);
  const scriptDialogMode = useKodtrolSelector((state) => state.dialogs.scriptDialogMode);
  const scriptDialogValue = useKodtrolSelector((state) => state.dialogs.scriptDialogValue);

  const title = getDialogTitle(scriptDialogMode);
  const bodyValue = scriptDialogValue || defaultValue;
  const bodyValid = scriptValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(scriptDialogMode);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideScriptDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (scriptDialogMode === KodtrolDialogType.EDIT) {
      dispatch(saveScriptAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createScriptAction(bodyValue));
    }
    dispatch(hideScriptDialogAction());
  }, [dispatch, bodyValue]);
  const applyHandler = useCallback(() => {
    if (scriptDialogMode === KodtrolDialogType.EDIT) {
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
      icon={KodtrolIconType.SCRIPT}
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
          {scriptDialogMode === KodtrolDialogType.EDIT && (
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
