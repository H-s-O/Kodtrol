import React from 'react';
import { get } from 'lodash';
import { Grid, Row, Col, Well } from 'react-bootstrap';
// import SplitPane from 'react-splitter-layout';
import SplitPane from 'react-split-pane';

import Panel from './components/partials/Panel';
import SmallWell from './components/partials/SmallWell';
import Welcome from './components/partials/Welcome';
import ScriptEditor from './components/partials/ScriptEditor';
import ScriptsBrowser from './components/partials/ScriptsBrowser';
import DevicesBrowser from './components/partials/DevicesBrowser';
import TimelinesBrowser from './components/partials/TimelinesBrowser';
// import Preview from './components/partials/Preview';
import Timeline from './components/partials/Timeline';

import styles from '../styles/layout.scss';

export default props => {
  return (
    <Grid fluid>
      <Row className={styles.topRow}>
        <Col md={2} className={styles.fullHeight}>
          <DevicesBrowser
            value={props.devices}
            onDeviceCreate={props.onDeviceCreate}
          />
        </Col>
        <Col md={2} className={styles.fullHeight}>
          <ScriptsBrowser
            value={props.scripts}
            devices={props.devices}
            onScriptSelect={props.onScriptSelect}
            onScriptCreate={props.onScriptCreate}
          />
        </Col>
        <Col md={8} className={styles.fullHeight}>
          <ScriptEditor
            value={props.currentScript}
            onSave={props.onEditorSave}
          />
        </Col>
      </Row>
      <Row className={styles.bottomRow}>
        <Col md={2} className={styles.fullHeight}>
          <TimelinesBrowser
            timelines={props.timelines}
            onTimelineSelect={props.onTimelineSelect}
            onTimelineCreate={props.onTimelineCreate}
          />
        </Col>
        <Col md={10} className={styles.fullHeight}>
          <Timeline
            position={get(props.timelineInfo, 'position', 0)}
            timelines={props.timelines}
            timelineData={props.currentTimeline}
            onSave={props.onTimelineSave}
          />
        </Col>
      </Row>
    </Grid>
  );
};
