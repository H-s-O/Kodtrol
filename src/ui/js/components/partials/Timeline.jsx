import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { remote } from 'electron';
import { get, isFunction } from 'lodash';
import { Button, Glyphicon, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import Panel from './Panel';
import percentString from '../../lib/percentString';
import AddTimelineBlock from '../modals/AddTimelineBlock';
import TimelineLayer from '../timeline/TimelineLayer';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  timelineData: PropTypes.shape({}),
  zoom: PropTypes.number,
  onSave: PropTypes.func,
  onStatusUpdate: PropTypes.func,
};

const defaultProps = {
  timelines: [],
  scripts: [],
  timelineData: null,
  position: 0,
  zoom: 1,
  onSave: null,
  onStatusUpdate: null,
};

class Timeline extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);

    this.timelineContainer = null;

    this.state = {
      showAddBlockModal: false,
      editBlockData: null,
      adjustBlockData: null,
      adjustBlockMode: null,
    };
  }

  findBlockLayer(sourceBlockData) {
    const { timelineData } = this.props;
    for (let layerIndex in timelineData.layers) {
      const layerData = timelineData.layers[layerIndex];
      for (let blockIndex in layerData) {
        const blockData = layerData[blockIndex];
        if (blockData.id == sourceBlockData.id) {
          return layerIndex;
        }
      }
    }
    return null;
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

  onEditBlock(blockData) {
    this.setState({
      showAddBlockModal: true,
      editBlockData: {
        ...blockData,
        layer: this.findBlockLayer(blockData),
      },
    });
  }

  onAdjustBlock(mode, blockData) {
    this.setState({
      adjustBlockMode: mode,
      adjustBlockData: {
        ...blockData,
        layer: this.findBlockLayer(blockData),
      },
    });
  }

  onMouseMove(e) {
    const { adjustBlockData, adjustBlockMode } = this.state;
    if (adjustBlockData !== null) {
      const { layer, ...blockInfo } = adjustBlockData;
      const { timelineData } = this.props;
      const newPosition = this.getTimelinePositionFromEvent(e);

      blockInfo[adjustBlockMode] = newPosition;

      timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].map((block) => {
        if (block.id == blockInfo.id) {
          return blockInfo;
        }
        return block;
      });

      this.triggerSave(timelineData);
    }
  }

  onMouseUp(e) {
    this.setState({
      adjustBlockData: null,
      adjustBlockMode: null,
    });
  }

  onDeleteBlock(blockData) {
    const layer = this.findBlockLayer(blockData);
    const { timelineData } = this.props;

    timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].filter((block) => {
      return block.id != blockData.id;
    });

    this.triggerSave(timelineData);
  }

  onDeleteLayer(index) {
    const { timelineData } = this.props;

    timelineData.layers = timelineData.layers.filter((layer, layerIndex) => {
      return layerIndex != index;
    });

    this.triggerSave(timelineData);
  }

  onTimelineClick(e) {
    e.preventDefault();

    const { onStatusUpdate } = this.props;

    if (isFunction(onStatusUpdate)) {
      const newPosition = this.getTimelinePositionFromEvent(e);
      onStatusUpdate({
        position: newPosition,
      });
    }
  }

  onAddBlockSuccess(blockData) {
    const { layer, ...blockInfo } = blockData;
    const { timelineData } = this.props;
    const { editBlockData } = this.state;

    if (editBlockData !== null) {
      timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].map((block) => {
        if (block.id == blockInfo.id) {
          return blockInfo;
        }
        return block;
      });
    } else {
      timelineData.layers[Number(layer)].push(blockInfo);
    }
    this.triggerSave(timelineData);

    this.setState({
      showAddBlockModal: false,
    });
  }

  onAddBlockCancel() {
    this.setState({
      showAddBlockModal: false,
      editBlockData: null,
    });
  }

  getTimelinePositionFromEvent(e, round = true) {
    const { timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    const { clientX } = e;
    const { left, right } = this.timelineContainer.getBoundingClientRect();
    const percent = (clientX - left) / (right - left);
    let newPosition = duration * percent;
    if (round) {
      newPosition = Math.round(newPosition);
    }
    return newPosition;
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

  renderTimelineLayer(layer, index, layers) {
    const { timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    return (
      <TimelineLayer
        key={`layer-${index}`}
        duration={duration}
        data={layer}
        totalLayers={layers.length}
        index={index}
        onDeleteLayer={this.onDeleteLayer}
        onDeleteBlock={this.onDeleteBlock}
        onEditBlock={this.onEditBlock}
        onAdjustBlock={this.onAdjustBlock}
      />
    );
  }

  renderTimelineTracker() {
    const { position, timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    const left = percentString(position / duration);
    return (
      <div
        className={styles.timelineTracker}
        style={{ left }}
      >
        <div
          className={styles.arrow}
        >
        </div>
      </div>
    );
  }

  renderTimeline(data) {
    const { zoom } = this.props;
    const layers = get(data, 'layers', []);
    return (
      <div
        className={styles.timeline}
        style={{ width: percentString(zoom) }}
      >
      { layers.length ? layers.map(this.renderTimelineLayer) : null }
      { layers.length ? this.renderTimelineTracker() : null }
      </div>
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
    const { showAddBlockModal, editBlockData, adjustBlockData } = this.state;

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
          ref={ (ref) => this.timelineContainer = ref }
          style={ { position: 'relative', width: '100%', height: '90%', overflowX: 'auto' }}
          onClick={ this.onTimelineClick }
          onMouseMove={adjustBlockData ? this.onMouseMove : null}
          onMouseUp={adjustBlockData ? this.onMouseUp : null}
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
