import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { get } from 'lodash';
import { Button, Glyphicon, Label, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import Panel from './Panel';
import percentString from '../../lib/percentString';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  data: PropTypes.shape({}),
  zoom: PropTypes.number,
};

const defaultProps = {
  // data: null,
  timelineData: {
    tempo: 120,
    duration: 3000,
    inTime: 0,
    outTime: 3000,
    layers: [
      [
        { name: 'Test script 1', inTime: 0, outTime: 2500, color: 'orange' },
      ],
      [
        { name: 'Test script 2', inTime: 1000, outTime: 2700, color: 'lightgreen' },
      ],
      [
        { name: 'Test script 3', inTime: 2500, outTime: 3000, color: 'red' },
      ],
    ],
  },
  position: 150,
  zoom: 1,
};

class Timeline extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  renderTimelineLayerBlock(block, index) {
    const { timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    const { inTime, outTime, color, name } = block;
    return (
      <svg
        key={`block-${index}`}
        x={percentString(inTime / duration)}
      >
        <rect
          width={percentString((outTime - inTime) / duration)}
          height={25}
          fill={color}
        />
        <text
          x="5"
          y="15"
        >
          { name }
        </text>
      </svg>
    );
  }

  renderTimelineLayer(layer, index, layers) {
    const layersCount = layers.length;
    return (
      <svg
        key={`layer-group-${index}`}
        y={percentString(0.1 + (index / layersCount))}
      >
        { layer.map(this.renderTimelineLayerBlock) }
      </svg>
    );
  }

  renderTimelineTracker() {
    const { position, timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    return (
      <svg
        x={percentString(position / duration)}
      >
        <polygon
          points="0,20 -20,0 20,0"
          fill="red"
        />
        <rect
          width="1"
          height="100%"
          fill="red"
        />
      </svg>
    );
  }

  renderTimeline(data) {
    const { zoom } = this.props;
    const layers = get(data, 'layers', []);
    return (
      <svg
        width={percentString(zoom)}
        height="100%"
      >
      <defs>
        <pattern
          id="timeline-marks"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="1"
            height="20"
            fill="#222"
          />
        </pattern>
      </defs>
      <g>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#timeline-marks)"
        />
      </g>
      { layers.map(this.renderTimelineLayer) }
      { this.renderTimelineTracker() }
      </svg>
    );
  }

  render() {
    const { timelineData } = this.props;
    return (
      <Panel
        title="Timeline"
        className={styles.fullHeight}
        headingContent={
          <ButtonToolbar>
            <ButtonGroup>
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
            </ButtonGroup>
            <Button
              bsSize="xsmall"
            >
              <Glyphicon
                glyph="search"
              />
            </Button>
          </ButtonToolbar>
        }
      >
        <div
          style={ { width: '100%', height: '90%', overflowX: 'auto' }}
        >
          { this.renderTimeline(timelineData) }
        </div>
      </Panel>
    );
  }
}

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;
