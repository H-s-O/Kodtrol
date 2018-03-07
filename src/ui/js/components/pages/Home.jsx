import React, { Component } from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';

import SmallWell from '../partials/SmallWell';
import Welcome from '../partials/Welcome';
import ScriptEditor from '../partials/ScriptEditor';

import styles from './home.scss';

export default class Main extends Component {
  render() {
    return (
      <Grid fluid>
        <Row className={styles.topRow} style={ {height: '70vh'}}>
          <Col md={2}>
            <SmallWell>
              Side menu
            </SmallWell>
          </Col>
          <Col md={6}>
            <SmallWell>
              <ScriptEditor />
            </SmallWell>
          </Col>
          <Col md={4}>
            <SmallWell>
              Preview
            </SmallWell>
          </Col>
        </Row>
        <Row className={styles.bottomRow}>
          <Col md={12}>
            <SmallWell>
              Timeline
            </SmallWell>
          </Col>
        </Row>
      </Grid>
    );
  }
}
