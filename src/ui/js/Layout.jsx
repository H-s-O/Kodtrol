import React from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';
// import SplitPane from 'react-splitter-layout';
import SplitPane from 'react-split-pane';

import Panel from './components/partials/Panel';
import SmallWell from './components/partials/SmallWell';
import Welcome from './components/partials/Welcome';
import ScriptEditor from './components/partials/ScriptEditor';
import ScriptsBrowser from './components/partials/ScriptsBrowser';
// import Preview from './components/partials/Preview';
import Timeline from './components/partials/Timeline';

import styles from '../styles/layout.scss';

export default props => {
  return (
    <Grid fluid>
      <Row className={styles.topRow}>
        <Col md={3} className={styles.fullHeight}>
          <ScriptsBrowser
            value={props.scripts}
            onScriptSelect={props.onScriptSelect}
          />
        </Col>
        <Col md={9} className={styles.fullHeight}>
          <ScriptEditor
            value={props.currentScript}
            onChange={props.onEditorChange}
            onSave={props.onEditorSave}
          />
        </Col>
      </Row>
      <Row className={styles.bottomRow}>
        <Col md={12} className={styles.fullHeight}>
          <Timeline>
            Timeline here lel!
          </Timeline>
        </Col>
      </Row>
    </Grid>
  );
};
