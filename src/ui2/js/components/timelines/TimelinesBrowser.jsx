import React from 'react';
import { connect } from "react-redux";
import { Icon, Button } from '@blueprintjs/core';

import ManagedTree from '../ui/ManagedTree';
import { editTimelineAction, runTimelineAction, stopTimelineAction } from '../../../../common/js/store/actions/timelines';

const generateLabel = (id, name, props) => {
  const { runTimeline } = props

  return (
    <>
      {name}
      {id === runTimeline && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent="success"
        />
      )}
    </>
  )
}

const generateActions = (id, props) => {
  const { doRunTimeline, runTimeline, doStopTimeline } = props;

  if (id === runTimeline) {
    return (
      <Button
        small
        minimal
        icon="eye-off"
        intent="danger"
        title="Stop running timeline"
        onClick={(e) => {
          e.stopPropagation();
          doStopTimeline();
        }}
      />
    )
  }

  return (
    <Button
      small
      minimal
      icon="eye-open"
      title="Run timeline"
      onClick={(e) => {
        e.stopPropagation();
        doRunTimeline(id);
      }}
    />
  )
}

function TimelinesBrowser(props) {
  const { timelines, doEditTimeline } = props;
  const contents = timelines.map(({ id, name }) => ({
    id,
    key: id,
    label: generateLabel(id, name, props),
    secondaryLabel: generateActions(id, props),
  }));

  return (
    <ManagedTree
      contents={contents}
      onNodeDoubleClick={({ id }) => doEditTimeline(id)}
    />
  );
}

const mapStateToProps = ({ timelines, runTimeline }) => ({
  timelines,
  runTimeline
});

const mapDispatchToProps = (dispatch) => ({
  doEditTimeline: (id) => dispatch(editTimelineAction(id)),
  doRunTimeline: (id) => dispatch(runTimelineAction(id)),
  doStopTimeline: () => dispatch(stopTimelineAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelinesBrowser);
