import React, { MouseEventHandler, useCallback } from 'react';
import { Icon, Button, Intent } from '@blueprintjs/core';
import { ok } from 'assert';

import {
  editTimelineAction,
  runTimelineAction,
  stopTimelineAction,
  deleteTimelineAction,
  focusEditedTimelineAction,
} from '../../store/actions/timelines';
import ItemBrowser from '../ui/ItemBrowser';
import { showTimelineDialogAction } from '../../store/actions/dialogs';
import contentRunning from '../../store/selectors/contentRunning';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { TimelineId } from '../../../../common/types';
import { KodtrolDialogType } from '../../constants';

const TimelineLabel = ({ item: { name, id }, activeItemId }) => {
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

const TimelineSecondaryLabel = ({ item: { id }, activeItemId }) => {
  const dispatch = useKodtrolDispatch();
  const runHandler: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runTimelineAction(id));
  }, [dispatch, id]);
  const stopHandler: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopTimelineAction());
  }, [dispatch]);
  const doubleClickHandler: MouseEventHandler = useCallback((e) => {
    // Trap accidental double clicks
    e.stopPropagation();
  }, []);

  if (id === activeItemId) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent={Intent.DANGER}
        title="Stop running timeline"
        onClick={stopHandler}
        onDoubleClick={doubleClickHandler}
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
      onDoubleClick={doubleClickHandler}
    />
  )
}

export default function TimelinesBrowser() {
  const timelines = useKodtrolSelector((state) => state.timelines);
  const runTimeline = useKodtrolSelector((state) => state.runTimeline);
  const editTimelines = useKodtrolSelector((state) => state.editTimelines);
  const isContentRunning = useKodtrolSelector(contentRunning);

  const dispatch = useKodtrolDispatch();
  const editCallback = useCallback((id: TimelineId) => {
    if (editTimelines.find((timeline) => timeline.id === id)) {
      dispatch(focusEditedTimelineAction(id));
    } else {
      const timeline = timelines.find((timeline) => timeline.id === id);
      ok(timeline, 'timeline not found');
      dispatch(editTimelineAction(id, timeline));
    }
  }, [dispatch, timelines, editTimelines]);
  const editPropsCallback = useCallback((id: TimelineId) => {
    const timeline = timelines.find((timeline) => timeline.id === id);
    ok(timeline, 'timeline not found');
    dispatch(showTimelineDialogAction(KodtrolDialogType.EDIT, timeline));
  }, [dispatch, timelines]);
  const duplicateCallback = useCallback((id: TimelineId) => {
    const timeline = timelines.find((timeline) => timeline.id === id);
    ok(timeline, 'timeline not found');
    dispatch(showTimelineDialogAction(KodtrolDialogType.DUPLICATE, timeline));
  }, [dispatch, timelines]);
  const deleteCallback = useCallback((id: TimelineId) => {
    dispatch(deleteTimelineAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="timeline"
      items={timelines}
      activeItemId={runTimeline}
      editCallback={editCallback}
      editPropsCallback={editPropsCallback}
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={TimelineLabel}
      itemSecondaryLabelComponent={TimelineSecondaryLabel}
      enableDelete={!isContentRunning}
    />
  );
}
