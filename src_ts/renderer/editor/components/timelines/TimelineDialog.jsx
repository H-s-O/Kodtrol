import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_TIMELINE } from '../../../../common/js/constants/icons';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import TimelineDialogBody from './TimelineDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideTimelineDialogAction, updateTimelineDialogAction } from '../../../../common/js/store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createTimelineAction, saveTimelineAction } from '../../../../common/js/store/actions/timelines';
import timelineValidator from '../../../../common/js/validators/timelineValidator';
import { DIALOG_ADD, DIALOG_DUPLICATE, DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import mergeDialogBody from '../../../../common/js/lib/mergeDialogBody';
import { getSuccessButtonLabel } from '../../lib/dialogHelpers';

const defaultValue = {
  name: null,
  duration: null,
  tempo: null,
};

const getDialogTitle = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate Timeline';
      break;
    case DIALOG_EDIT:
      return 'Edit Timeline';
      break;
    case DIALOG_ADD:
    default:
      return 'Add Timeline';
      break;
  }
}

export default function TimelineDialog() {
  const timelineDialogOpened = useSelector((state) => state.dialogs.timelineDialogOpened);
  const timelineDialogMode = useSelector((state) => state.dialogs.timelineDialogMode);
  const timelineDialogValue = useSelector((state) => state.dialogs.timelineDialogValue);

  const title = getDialogTitle(timelineDialogMode);
  const bodyValue = timelineDialogValue || defaultValue;
  const bodyValid = timelineValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(timelineDialogMode);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideTimelineDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (timelineDialogMode === DIALOG_EDIT) {
      dispatch(saveTimelineAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createTimelineAction(bodyValue));
    }
    dispatch(hideTimelineDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateTimelineDialogAction(mergeDialogBody(bodyValue, value, field)));
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={timelineDialogOpened}
      title={title}
      icon={ICON_TIMELINE}
      onClose={closeHandler}
      className="timeline-dialog"
    >
      <DialogBody>
        <TimelineDialogBody
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
