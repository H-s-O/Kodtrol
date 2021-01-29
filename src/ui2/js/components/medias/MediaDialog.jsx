import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';

import { ICON_MEDIA } from '../../../../common/js/constants/icons';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import MediaDialogBody from './MediaDialogBody';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideMediaDialogAction, updateMediaDialogAction } from '../../../../common/js/store/actions/dialogs';
import CustomDialog from '../ui/CustomDialog';
import { createMediaAction, saveMediaAction } from '../../../../common/js/store/actions/medias';
import mediaValidator from '../../../../common/js/validators/mediaValidator';
import { DIALOG_ADD, DIALOG_DUPLICATE, DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import mergeDialogBody from '../../../../common/js/lib/mergeDialogBody';
import { getSuccessButtonLabel } from '../../lib/dialogHelpers';

const defaultValue = {
  file: null,
  name: null,
  duration: null,
  output: null,
};

const getDialogTitle = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate Media';
      break;
    case DIALOG_EDIT:
      return 'Edit Media';
      break;
    case DIALOG_ADD:
    default:
      return 'Add Media';
      break;
  }
}

export default function MediaDialog() {
  const mediaDialogOpened = useSelector((state) => state.dialogs.mediaDialogOpened);
  const mediaDialogMode = useSelector((state) => state.dialogs.mediaDialogMode);
  const mediaDialogValue = useSelector((state) => state.dialogs.mediaDialogValue);

  const title = getDialogTitle(mediaDialogMode);
  const bodyValue = mediaDialogValue || defaultValue;
  const bodyValid = mediaValidator(bodyValue);
  const successLabel = getSuccessButtonLabel(mediaDialogMode);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideMediaDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    if (mediaDialogMode === DIALOG_EDIT) {
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
      icon={ICON_MEDIA}
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
