import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { basename } from 'path';

import ManagedTree from '../ui/ManagedTree';
import { showMediaDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT } from '../../../../common/js/constants/dialogs';

const getDisplayName = (file, name) => {
  return name ? name : basename(file);
}

export default function MediasBrowser() {
  const medias = useSelector((state) => state.medias);

  const dispatch = useDispatch();
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      const media = medias.find((media) => media.id === id);
      dispatch(showMediaDialogAction(DIALOG_EDIT, media));
    }
  }, [dispatch, medias]);

  const items = medias.map(({ id, name, file }) => ({
    id,
    key: id,
    label: getDisplayName(file, name),
  }));

  return (
    <ManagedTree
      items={items}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}
