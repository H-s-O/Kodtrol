import React, { useCallback } from 'react';
import { ok } from 'assert';

import { showMediaDialogAction } from '../../store/actions/dialogs';
import ItemBrowser from '../ui/ItemBrowser';
import { deleteMediaAction } from '../../store/actions/medias';
import contentRunning from '../../store/selectors/contentRunning';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { KodtrolDialogType } from '../../constants';
import { Media, MediaId } from '../../../../common/types';

const itemPropsFilter = ({ name, file }: Media) => ({ name, file })

const MediaLabel = ({ item: { name, file } }) => {
  return name ? name : window.kodtrol_editor.path.basename(file);
}

export default function MediasBrowser() {
  const medias = useKodtrolSelector((state) => state.medias);
  const isContentRunning = useKodtrolSelector(contentRunning);

  const dispatch = useKodtrolDispatch();
  const editPropsCallback = useCallback((id: MediaId) => {
    const media = medias.find((media) => media.id === id);
    ok(media, 'media not found');
    dispatch(showMediaDialogAction(KodtrolDialogType.EDIT, media));
  }, [dispatch, medias]);
  const duplicateCallback = useCallback((id: MediaId) => {
    const media = medias.find((media) => media.id === id);
    ok(media, 'media not found');
    dispatch(showMediaDialogAction(KodtrolDialogType.DUPLICATE, media));
  }, [dispatch, medias]);
  const deleteCallback = useCallback((id: MediaId) => {
    dispatch(deleteMediaAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="media"
      items={medias}
      editPropsCallback={editPropsCallback}
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={MediaLabel}
      itemPropsFilter={itemPropsFilter}
      enableDelete={!isContentRunning}
    />
  );
}
