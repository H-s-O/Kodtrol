import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { basename } from 'path';

import { showMediaDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import ItemBrowser from '../ui/ItemBrowser';
import { deleteMediaAction } from '../../../../common/js/store/actions/medias';

const MediaLabel = ({name, file}) => {
  return name ? name : basename(file);
}

export default function MediasBrowser() {
  const medias = useSelector((state) => state.medias);
  const mediasFolders = useSelector((state) => state.mediasFolders);

  const dispatch = useDispatch();
  const editPropsCallback = useCallback((id) => {
    const media = medias.find((media) => media.id === id);
    dispatch(showMediaDialogAction(DIALOG_EDIT, media));
  }, [dispatch, medias]);
  const deleteCallback = useCallback((id) => {
    dispatch(deleteMediaAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="media"
      items={medias}
      folders={mediasFolders}
      editPropsCallback={editPropsCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={MediaLabel}
      extraComponentProp="file"
    />
  );
}
