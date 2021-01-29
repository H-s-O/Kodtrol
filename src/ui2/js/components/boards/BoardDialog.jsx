import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_TIMELINE } from '../../../../common/js/constants/icons';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import BoardDialogBody from './BoardDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideBoardDialogAction, updateBoardDialogAction } from '../../../../common/js/store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createBoardAction, saveBoardAction } from '../../../../common/js/store/actions/boards';
import boardValidator from '../../../../common/js/validators/boardValidator';
import { DIALOG_ADD, DIALOG_DUPLICATE, DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import mergeDialogBody from '../../../../common/js/lib/mergeDialogBody';
import { getSuccessButtonLabel } from '../../lib/dialogHelpers';

const defaultValue = {
  name: null,
  tempo: null,
};

const getDialogTitle = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate Board';
      break;
    case DIALOG_EDIT:
      return 'Edit Board';
      break;
    case DIALOG_ADD:
    default:
      return 'Add Board';
      break;
  }
}

export default function BoardDialog() {
  const boardDialogOpened = useSelector((state) => state.dialogs.boardDialogOpened);
  const boardDialogMode = useSelector((state) => state.dialogs.boardDialogMode);
  const boardDialogValue = useSelector((state) => state.dialogs.boardDialogValue);

  const title = getDialogTitle(boardDialogMode);
  const bodyValue = boardDialogValue || defaultValue;
  const bodyValid = boardValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(boardDialogMode);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideBoardDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (boardDialogMode === DIALOG_EDIT) {
      dispatch(saveBoardAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createBoardAction(bodyValue));
    }
    dispatch(hideBoardDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateBoardDialogAction(mergeDialogBody(bodyValue, value, field)));
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={boardDialogOpened}
      title={title}
      icon={ICON_TIMELINE}
      onClose={closeHandler}
      className="board-dialog"
    >
      <DialogBody>
        <BoardDialogBody
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
