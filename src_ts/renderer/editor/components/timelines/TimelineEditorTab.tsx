import React, { useCallback } from 'react';
import { ok } from 'assert';

import { updateEditedTimelineAction } from '../../store/actions/timelines';
import TimelineEditor from './editor/TimelineEditor';
import { TimelineId } from '../../../../common/types';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';

type TimelineEditorTabProps = {
  id: TimelineId
};

export default function TimelineEditorTab({ id }: TimelineEditorTabProps) {
  const editTimelines = useKodtrolSelector((state) => state.editTimelines);
  const timeline = editTimelines.find((timeline) => timeline.id === id);
  ok(timeline, 'timeline not found');

  const dispatch = useKodtrolDispatch();
  const changeHandler = useCallback((newValue) => {
    dispatch(updateEditedTimelineAction(id, newValue));
  }, [dispatch, id]);

  return null;
  // return (
  //   <TimelineEditor
  //     timeline={timeline}
  //     onChange={changeHandler}
  //   />
  // );
}
