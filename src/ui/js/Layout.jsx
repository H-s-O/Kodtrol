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
import TimelineEditor from './components/partials/TimelineEditor';
import ModalsContainer from './components/partials/ModalsContainer';

import styles from '../styles/layout.scss';

export default props => {
  return (
    <div>
      <ModalsContainer
      />
      <Grid fluid>
        <Row className={styles.topRow}>
          <Col md={2} className={styles.fullHeight}>
            <DevicesBrowser
            />
          </Col>
          <Col md={2} className={styles.fullHeight}>
            <ScriptsBrowser
            />
          </Col>
          <Col md={8} className={styles.fullHeight}>
            <ScriptEditor
            />
          </Col>
        </Row>
        <Row className={styles.bottomRow}>
          <Col md={2} className={styles.fullHeight}>
            <TimelinesBrowser
            />
          </Col>
          <Col md={10} className={styles.fullHeight}>
            <TimelineEditor
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
