import React, { PureComponent } from 'react';
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
  onStatusUpdate: PropTypes.func,
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

  onEditBlockClick(blockData) {
    this.setState({
      showAddBlockModal: true,
      editBlockData: {
        ...blockData,
        layer: this.findBlockLayer(blockData),
      },
    });
  }

  onDeleteBlockClick(blockData) {
    const layer = this.findBlockLayer(blockData);
    const { timelineData } = this.props;

    timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].filter((block) => {
      return block.id != blockData.id;
    });

    this.triggerSave(timelineData);
  }

  onDeleteLayerClick(index) {
    const { timelineData } = this.props;

    timelineData.layers = timelineData.layers.filter((layer, layerIndex) => {
      return layerIndex != index;
    });

    this.triggerSave(timelineData);
  }

  onTimelineClick(e) {
    e.preventDefault();

    const { onStatusUpdate, timelineData } = this.props;
    if (isFunction(onStatusUpdate)) {
      const duration = get(timelineData, 'duration');
      const { clientX } = e;
      const { left, right } = this.timelineContainer.getBoundingClientRect();
      const percent = (clientX - left) / right;
      const newPosition = duration * percent;
      onStatusUpdate({
        position: newPosition,
      });
    }
  }

  onTimelineBlockContextMenu(e, block) {
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Edit block...',
      click: () => this.onEditBlockClick(block),
    }));
    menu.append(new MenuItem({
      label: 'Delete block',
      click: () => this.onDeleteBlockClick(block),
    }));

    e.stopPropagation();
    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  onTimelineLayerContextMenu(e, index) {
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Delete layer',
      click: () => this.onDeleteLayerClick(index),
    }));

    e.stopPropagation();
    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow(),
    });
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
      <div
        title={name}
        className={styles.timelineBlock}
        key={`block-${index}`}
        style={{
          left: percentString(inTime / duration),
          backgroundColor: color,
          width: percentString((outTime - inTime) / duration),
        }}
        onContextMenu={(e) => this.onTimelineBlockContextMenu(e, block)}
      >
        <span
          style={{
            backgroundColor: color,
          }}
          className={styles.timelimeBlockLabel}
        >
          { name }
        </span>
      </div>
    );
  }

  renderTimelineLayer(layer, index, layers) {
    const layersCount = Math.max(4, layers.length);
    const layerHeight = (1 / layersCount);
    const top = percentString(1 - ((index + 1) * layerHeight));
    const height = percentString(layerHeight * 0.9);
    return (
      <div
        className={styles.timelineLayer}
        key={`layer-group-${index}`}
        style={{ top, height }}
        onContextMenu={(e) => this.onTimelineLayerContextMenu(e, index)}
      >
        { layer.map(this.renderTimelineLayerBlock) }
      </div>
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
          ref={ (ref) => this.timelineContainer = ref }
          style={ { position: 'relative', width: '100%', height: '90%', overflowX: 'auto' }}
          onClick={ this.onTimelineClick }
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
