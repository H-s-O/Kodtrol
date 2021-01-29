import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { basename } from 'path';

import { showMediaDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT, DIALOG_DUPLICATE } from '../../../../common/js/constants/dialogs';
import ItemBrowser from '../ui/ItemBrowser';
import { deleteMediaAction } from '../../../../common/js/store/actions/medias';
import contentRunning from '../../../../common/js/store/selectors/contentRunning';

const itemPropsFilter = ({  name, file }) => ({ name, file })

const MediaLabel = ({ item: { name, file } }) => {
  return name ? name : basename(file);
}

export default function MediasBrowser() {
  const medias = useSelector((state) => state.medias);
  const mediasFolders = useSelector((state) => state.mediasFolders);
  const isContentRunning = useSelector(contentRunning);

  const dispatch = useDispatch();
  const editPropsCallback = useCallback((id) => {
    const media = medias.find((media) => media.id === id);
    dispatch(showMediaDialogAction(DIALOG_EDIT, media));
  }, [dispatch, medias]);
  const duplicateCallback = useCallback((id) => {
    const media = medias.find((media) => media.id === id);
    dispatch(showMediaDialogAction(DIALOG_DUPLICATE, media));
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
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={MediaLabel}
      itemPropsFilter={itemPropsFilter}
      enableDelete={!isContentRunning}
    />
  );
}
