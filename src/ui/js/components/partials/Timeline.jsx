import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { remote } from 'electron';
import { get, isFunction } from 'lodash';
import { Button, Glyphicon, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import Panel from './Panel';
import percentString from '../../lib/percentString';
import AddTimelineBlock from '../modals/AddTimelineBlock';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  timelineData: PropTypes.shape({}),
  zoom: PropTypes.number,
  onSave: PropTypes.func,
};

const defaultProps = {
  timelines: [],
  scripts: [],
  timelineData: null,
  // timelineData: {
  //   tempo: 120,
  //   duration: 3000,
  //   inTime: 0,
  //   outTime: 3000,
  //   layers: [
  //     [
  //       { name: 'Test script 1', id: '2910312', script: '2r88y9cy2cjg8tb73c', inTime: 0, outTime: 2500, color: 'orange' },
  //     ],
  //     [
  //       { name: 'Test script 2', id: 'kod089sduf0sd', script: '2r88y9cy2cjg8tb73c', inTime: 1000, outTime: 2700, color: 'lightgreen' },
  //     ],
  //     [
  //       { name: 'Test script 3', id: '291huidsjhads', script: '2r88y9cy2cjg8tb73c', inTime: 2500, outTime: 3000, color: 'red' },
  //     ],
  //   ],
  // },
  position: 0,
  zoom: 1,
  onSave: null,
};

class Timeline extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddBlockModal: false,
      editBlockData: null,
    };
  }

  onAddLayerClick() {
    const { timelineData } = this.props;
    timelineData.layers.push([]);
    this.triggerSave(timelineData);
  }

  onAddBlockClick() {
    this.setState({
      showAddBlockModal: true,
      editBlockData: null,
    });
  }

  onEditBlockClick(blockData) {
    this.setState({
      showAddBlockModal: true,
      editBlockData: blockData,
    });
  }

  onTimelineBlockContextMenu(e, block) {
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Edit block...',
      click: () => this.onEditBlockClick(block),
    }));

    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  onAddBlockSuccess(blockData) {
    const { layer, ...blockInfo } = blockData;
    const { timelineData } = this.props;
    timelineData.layers[Number(layer)].push(blockInfo);
    this.triggerSave(timelineData);

    this.setState({
      showAddBlockModal: false,
    });
  }

  onAddBlockCancel() {
    this.setState({
      showAddBlockModal: false,
    });
  }

  triggerSave(value) {
    const { onSave } = this.props;
    if (isFunction(onSave)) {
      const { id } = value;
      onSave({
        id,
        content: value,
      });
    }
  }

  renderTimelineLayerBlock(block, index) {
    const { timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    const { inTime, outTime, color, name } = block;
    return (
      <svg
        key={`block-${index}`}
        x={percentString(inTime / duration)}
        onContextMenu={(e) => this.onTimelineBlockContextMenu(e, block)}
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
        y={percentString(1 - (0.26 * (index / layersCount)) - 0.1)}
      >
        <rect
          width="100%"
          height="25"
          fill="#000"
          fillOpacity="0.25"
        />
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
      { layers.length && layers.map(this.renderTimelineLayer) }
      { layers.length && this.renderTimelineTracker() }
      </svg>
    );
  }

  renderTimelineControls() {
    return (
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
    );
  }

  renderAddItems() {
    return (
      <DropdownButton
        noCaret
        title={(
          <Glyphicon
            glyph="plus"
          />
        )}
        key="asdas"
        bsSize="xsmall"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onSelect={this.onAddLayerClick}>Add layer</MenuItem>
        <MenuItem onSelect={this.onAddBlockClick}>Add block</MenuItem>
      </DropdownButton>
    );
  }

  render() {
    const { timelineData, timelines, scripts } = this.props;
    const { showAddBlockModal, editBlockData } = this.state;

    return (
      <Panel
        title="Timeline editor"
        className={styles.fullHeight}
        headingContent={
          timelineData && (
            <ButtonToolbar>
              { this.renderTimelineControls() }
              { this.renderAddItems() }
              <Button
                bsSize="xsmall"
              >
                <Glyphicon
                  glyph="search"
                />
              </Button>
            </ButtonToolbar>
          )
        }
      >
        <div
          style={ { width: '100%', height: '90%', overflowX: 'auto' }}
        >
          { this.renderTimeline(timelineData) }
        </div>
        <AddTimelineBlock
          initialValue={editBlockData}
          show={showAddBlockModal}
          onCancel={this.onAddBlockCancel}
          onSuccess={this.onAddBlockSuccess}
          scripts={scripts}
          layers={(timelineData || {}).layers}
        />
      </Panel>
    );
  }
}

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;
