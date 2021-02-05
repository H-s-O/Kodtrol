import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateEditedTimelineAction } from '../../../../common/js/store/actions/timelines';
import TimelineEditor from './editor/TimelineEditor';

export default function TimelineEditorTab({ id }) {
  const editTimelines = useSelector((state) => state.editTimelines);
  const timeline = editTimelines.find((timeline) => timeline.id === id);

  const dispatch = useDispatch();
  const changeHandler = useCallback((newValue) => {
    dispatch(updateEditedTimelineAction(id, newValue));
  }, [dispatch, id]);

  return (
    <TimelineEditor
      timeline={timeline}
      onChange={changeHandler}
    />
  );
}
