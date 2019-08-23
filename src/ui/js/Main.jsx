import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import ScriptEditor from './components/partials/ScriptEditor';
import ScriptsBrowser from './components/partials/ScriptsBrowser';
import DevicesBrowser from './components/partials/DevicesBrowser';
import TimelinesBrowser from './components/partials/TimelinesBrowser';
import TimelineEditor from './components/timeline/TimelineEditor';
import BoardEditor from './components/board/BoardEditor';
import MediasBrowser from './components/partials/MediasBrowser'
import ModalsContainer from './components/partials/ModalsContainer';
import Placeholder from './components/partials/Placeholder';
import MainNav from './components/partials/MainNav';

import styles from '../styles/main.scss';

const mapStateToProps = ({currentTimeline, currentScript, currentBoard}) => {
  return {
    currentTimeline,
    currentScript,
    currentBoard,
  };
};

export default connect(mapStateToProps)((props) => {
  return (
    <Fragment>
      <Grid fluid>
        <Row className={styles.headerRow}>
          <Col md={12} className={styles.fullHeight}>
            <MainNav/>
          </Col>
        </Row>
        <Row className={styles.topRow}>
          <Col md={2} className={styles.fullHeight}>
            <DevicesBrowser/>
          </Col>
          <Col md={2} className={styles.fullHeight}>
            <ScriptsBrowser/>
          </Col>
          <Col md={8} className={styles.fullHeight}>
            { props.currentScript
              ? <ScriptEditor key={props.currentScript} />
              : <Placeholder/> }
          </Col>
        </Row>
        <Row className={styles.bottomRow}>
          <Col md={2} className={styles.fullHeight}>
            <MediasBrowser/>
          </Col>
          <Col md={2} className={styles.fullHeight}>
            <TimelinesBrowser/>
          </Col>
          <Col md={8} className={styles.fullHeight}>
            { props.currentTimeline
              ? <TimelineEditor key={props.currentTimeline} />
              : props.currentBoard 
                ? <BoardEditor key={props.currentBoard} />
                : <Placeholder/> }
          </Col>
        </Row>
      </Grid>
      <ModalsContainer/>
    </Fragment>
  );
});
