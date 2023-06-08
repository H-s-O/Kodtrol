import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import TimelineDialogBody from './TimelineDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideTimelineDialogAction, updateTimelineDialogAction } from '../../store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createTimelineAction, saveTimelineAction } from '../../store/actions/timelines';
import { KodtrolDialogType, KodtrolIconType } from '../../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { timelineValidator } from '../../validators/timelineValidators';
import { getSuccessButtonLabel, mergeDialogBody } from '../../lib/helpers';

const defaultValue = {
  name: null,
  duration: null,
  tempo: null,
};

const getDialogTitle = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate Timeline';
      break;
    case KodtrolDialogType.EDIT:
      return 'Edit Timeline Properties';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add Timeline';
      break;
  }
}

export default function TimelineDialog() {
  const timelineDialogOpened = useKodtrolSelector((state) => state.dialogs.timelineDialogOpened);
  const timelineDialogMode = useKodtrolSelector((state) => state.dialogs.timelineDialogMode);
  const timelineDialogValue = useKodtrolSelector((state) => state.dialogs.timelineDialogValue);

  const title = getDialogTitle(timelineDialogMode);
  const bodyValue = timelineDialogValue || defaultValue;
  const bodyValid = timelineValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(timelineDialogMode);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideTimelineDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (timelineDialogMode === KodtrolDialogType.EDIT) {
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
      icon={KodtrolIconType.TIMELINE}
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
