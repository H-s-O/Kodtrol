import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';

import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import MediaDialogBody from './MediaDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideMediaDialogAction, updateMediaDialogAction } from '../../store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createMediaAction, saveMediaAction } from '../../store/actions/medias';
import { KodtrolDialogType, KodtrolIconType } from '../../constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { getSuccessButtonLabel, mergeDialogBody } from '../../lib/helpers';
import { mediaValidator } from '../../validators/mediaValidators';

const defaultValue = {
  file: null,
  name: null,
  duration: null,
  output: null,
};

const getDialogTitle = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate Media';
      break;
    case KodtrolDialogType.EDIT:
      return 'Edit Media Properties';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add Media';
      break;
  }
};

export default function MediaDialog() {
  const mediaDialogOpened = useKodtrolSelector((state) => state.dialogs.mediaDialogOpened);
  const mediaDialogMode = useKodtrolSelector((state) => state.dialogs.mediaDialogMode);
  const mediaDialogValue = useKodtrolSelector((state) => state.dialogs.mediaDialogValue);

  const title = getDialogTitle(mediaDialogMode);
  const bodyValue = mediaDialogValue || defaultValue;
  const bodyValid = mediaValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(mediaDialogMode);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideMediaDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (mediaDialogMode === KodtrolDialogType.EDIT) {
      dispatch(saveMediaAction(bodyValue.id, bodyValue));
    } else {
      dispatch(createMediaAction(bodyValue));
    }
    dispatch(hideMediaDialogAction());
  }, [dispatch, bodyValue]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateMediaDialogAction(mergeDialogBody(bodyValue, value, field)));
  }, [dispatch, bodyValue]);

  return (
    <CustomDialog
      isOpen={mediaDialogOpened}
      title={title}
      icon={KodtrolIconType.MEDIA}
      onClose={closeHandler}
      className="media-dialog"
    >
      <DialogBody>
        <MediaDialogBody
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
