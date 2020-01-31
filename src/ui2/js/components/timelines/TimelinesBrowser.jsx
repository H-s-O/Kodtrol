import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon, Button, Intent } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { editTimelineAction, runTimelineAction, stopTimelineAction } from '../../../../common/js/store/actions/timelines';

const TimelineLabel = ({ name, running }) => {
  return (
    <>
      {name}
      {running && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  )
}

const TimelineSecondaryLabel = ({ id, running }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runTimelineAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopTimelineAction());
  }, [dispatch]);

  if (running) {
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
  const runTimeline = useSelector((state) => state.runTimeline);

  const dispatch = useDispatch()
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      const timeline = timelines.find((timeline) => timeline.id === id);
      dispatch(editTimelineAction(id, timeline));
    }
  })

  const items = timelines.map(({ id, name }) => {
    const running = id === runTimeline;
    return {
      id,
      key: id,
      label: (
        <TimelineLabel
          name={name}
          running={running}
        />
      ),
      secondaryLabel: (
        <TimelineSecondaryLabel
          id={id}
          running={running}
        />
      ),
    }
  });

  return (
    <ManagedTree
      items={items}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}
