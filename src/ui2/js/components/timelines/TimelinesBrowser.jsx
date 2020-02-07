import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon, Button, Intent } from '@blueprintjs/core';

import { editTimelineAction, runTimelineAction, stopTimelineAction, deleteTimelineAction } from '../../../../common/js/store/actions/timelines';
import ItemBrowser from '../ui/ItemBrowser';
import { showTimelineDialogAction } from '../../../../common/js/store/actions/dialogs';
import { DIALOG_EDIT } from '../../../../common/js/constants/dialogs';

const TimelineLabel = ({ name, id, activeItemId }) => {
  return (
    <>
      {name}
      {id === activeItemId && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  )
}

const TimelineSecondaryLabel = ({ id, activeItemId }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runTimelineAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopTimelineAction());
  }, [dispatch]);

  if (id === activeItemId) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent={Intent.DANGER}
        title="Stop running timeline"
        onClick={stopHandler}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run timeline"
      onClick={runHandler}
    />
  )
}

export default function TimelinesBrowser() {
  const timelines = useSelector((state) => state.timelines);
  const timelinesFolders = useSelector((state) => state.timelinesFolders);
  const runTimeline = useSelector((state) => state.runTimeline);

  const dispatch = useDispatch();
  const editCallback = useCallback((id) => {
    const timeline = timelines.find((timeline) => timeline.id === id);
    dispatch(editTimelineAction(id, timeline));
  }, [dispatch, timelines])
  const editPropsCallback = useCallback((id) => {
    const timeline = timelines.find((timeline) => timeline.id === id);
    dispatch(showTimelineDialogAction(DIALOG_EDIT, timeline));
  }, [dispatch, timelines]);
  const deleteCallback = useCallback((id) => {
    dispatch(deleteTimelineAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="timeline"
      items={timelines}
      folders={timelinesFolders}
      activeItemId={runTimeline}
      editCallback={editCallback}
      editPropsCallback={editPropsCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={TimelineLabel}
      itemSecondaryLabelComponent={TimelineSecondaryLabel}
    />
  );
}
