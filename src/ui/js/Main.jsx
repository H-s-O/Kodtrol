import React, { Fragment } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import ScriptEditor from './components/partials/ScriptEditor';
import ScriptsBrowser from './components/partials/ScriptsBrowser';
import DevicesBrowser from './components/partials/DevicesBrowser';
import TimelinesBrowser from './components/partials/TimelinesBrowser';
import TimelineEditor from './components/partials/TimelineEditor';
import ModalsContainer from './components/partials/ModalsContainer';

import styles from '../styles/main.scss';

export default props => {
  return (
    <Fragment>
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
      <ModalsContainer
      />
    </Fragment>
  );
};
