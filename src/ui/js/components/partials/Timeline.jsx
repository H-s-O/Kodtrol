import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Label, ButtonToolbar } from 'react-bootstrap';
import Panel from './Panel';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  data: PropTypes.shape({}),
};

const defaultProps = {
  data: null,
};

class Timeline extends Component {
  render() {
    return (
      <Panel
        title="Timeline"
        className={styles.fullHeight}
        headingContent={
          <ButtonToolbar>
            <Button
              bsSize="xsmall"
            >
              <Glyphicon
                glyph="step-backward"
              />
            </Button>
            <Button
              bsSize="xsmall"
            >
              <Glyphicon
                glyph="play"
              />
            </Button>
            <Button
              bsSize="xsmall"
            >
              <Glyphicon
                glyph="stop"
              />
            </Button>
            <Button
              bsSize="xsmall"
            >
              <Glyphicon
                glyph="step-forward"
              />
            </Button>
          </ButtonToolbar>
        }
      >

      </Panel>
    );
  }
}

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;
