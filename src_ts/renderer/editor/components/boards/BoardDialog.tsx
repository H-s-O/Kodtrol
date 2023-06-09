import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import BoardDialogBody from './BoardDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideBoardDialogAction, updateBoardDialogAction } from '../../store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createBoardAction, saveBoardAction } from '../../store/actions/boards';
import { KodtrolDialogType, KodtrolIconType } from '../../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { getSuccessButtonLabel, mergeDialogBody } from '../../lib/helpers';
import { boardValidator } from '../../validators/boardValidators';

const defaultValue = {
  name: null,
  tempo: null,
};

const getDialogTitle = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate Board';
      break;
    case KodtrolDialogType.EDIT:
      return 'Edit Board Properties';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add Board';
      break;
  }
};

export default function BoardDialog() {
  const boardDialogOpened = useKodtrolSelector((state) => state.dialogs.boardDialogOpened);
  const boardDialogMode = useKodtrolSelector((state) => state.dialogs.boardDialogMode);
  const boardDialogValue = useKodtrolSelector((state) => state.dialogs.boardDialogValue);

  const title = getDialogTitle(boardDialogMode);
  const bodyValue = boardDialogValue || defaultValue;
  const bodyValid = boardValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(boardDialogMode);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideBoardDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (boardDialogMode === KodtrolDialogType.EDIT) {
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
      icon={KodtrolIconType.BOARD}
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
