import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Glyphicon, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';

import Panel from './Panel';
import percentString from '../../lib/percentString';
import stopEvent from '../../lib/stopEvent';
import TimelineTriggerModal from '../modals/TimelineTriggerModal';
import TimelineBlockModal from '../modals/TimelineBlockModal';
import TimelineLayer from '../timeline/TimelineLayer';
import { updateCurrentTimeline, saveTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineInfo } from '../../../../common/js/store/actions/timelineInfo';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  timelineData: PropTypes.shape({}),
  timelineInfo: PropTypes.shape({}),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doUpdateCurrentTimeline: PropTypes.func.isRequired,
  doUpdateTimelineInfo: PropTypes.func.isRequired,
  doSaveTimeline: PropTypes.func.isRequired,
};

const defaultProps = {
  timelineData: null,
  timelineInfo: null,
  scripts: [],
};

class TimelineEditor extends PureComponent {
  timelineContainer = null;

  state = {
    modalType: null,
    modalAction: null,
    modalValue: null,
    
    editBlockData: null,
    adjustBlockData: null,
    adjustBlockMode: null,
    copyBlockData: null,
  };

  findItemLayer = (sourceData) => {
    const { timelineData } = this.props;
    for (let layerIndex in timelineData.layers) {
      const layerData = timelineData.layers[layerIndex];
      for (let itemIndex in layerData) {
        const itemData = layerData[itemIndex];
        if (itemData.id == sourceData.id) {
          return layerIndex;
        }
      }
    }
    return null; 
  }
  
  onSaveClick = () => {
    const { timelineData, doSaveTimeline } = this.props;
    doSaveTimeline(timelineData);
  }

  onAddLayerClick = () => {
    const { timelineData } = this.props;
    timelineData.layers.push([]);
    this.doSave(timelineData);
  }
  
  onAddBlockClick = () => {
    this.doAddItem('block', {
      id: uniqid(), // generate new block id
    });
  }
  
  onAddTriggerClick = () => {
    this.doAddItem('trigger', {
      id: uniqid(), // generate new trigger id
    });
  }

  doAddItem = (type, baseData) => {
    this.setState({
      modalType: type,
      modalValue: baseData,
      modalAction: 'add',
    });
  }

  onEditItem = (itemData) => {
    let type = null;
    if ('script' in itemData) {
      type = 'block';
    } else if ('trigger' in itemData) {
      type = 'trigger';
    } else if ('curve' in itemData) {
      type = 'curve';
    }
    
    this.setState({
      modalType: type,
      modalValue: {
        ...itemData,
        layer: this.findItemLayer(itemData), // add layer id
      },
      modalAction: 'edit',
    });
  }

  onItemModalSuccess = (itemData) => {
    const { layer, ...itemInfo } = itemData;
    const { timelineData } = this.props;

    // Attempt to find item index if existing
    const itemIndex = timelineData.layers[Number(layer)].findIndex(({id}) => id === itemInfo.id); 
    
    // If item does not exists, add it
    if (itemIndex === -1) {
      timelineData.layers[Number(layer)].push(itemInfo);
    } 
    // Update existing item
    else {
      timelineData.layers[Number(layer)][itemIndex] = itemInfo;
    }
    
    // Save timeline
    this.doSave(timelineData);

    // Hide modal
    this.setState({
      modalType: null,
    });
  }

  onItemModalCancel = () => {
    this.setState({
      modalType: null,
    });
  }
  
  onZoomLevelClick = (level) => {
    const { timelineData, doUpdateCurrentTimeline } = this.props;
    const data = {
      ...timelineData,
      zoom: level,
    };
    doUpdateCurrentTimeline(data);
  }
  
  onAdjustItem = (mode, blockData) => {
    this.setState({
      adjustBlockMode: mode,
      adjustBlockData: {
        ...blockData,
        layer: this.findItemLayer(blockData),
      },
    });
  }

  onCopyItem = (mode, blockData) => {
    this.setState({
      copyBlockData: get(blockData, mode),
    });
  }

  onPasteItem = (mode, blockData) => {
    const { copyBlockData } = this.state;
    if (copyBlockData !== null) {
      const layer = this.findItemLayer(blockData);
      const { timelineData } = this.props;
      const blockInfo = {
        ...blockData,
        [mode]: copyBlockData,
      };

      timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].map((block) => {
        if (block.id == blockInfo.id) {
          return blockInfo;
        }
        return block;
      });

      this.doSave(timelineData);

      this.setState({
        copyBlockData: null,
      });
    }
  }
  
  onAddItemAt = (type, layer, e) => {
    const data = {
      layer,
      id: uniqid(), // generate new trigger id
      inTime: this.getTimelinePositionFromEvent(e),
    };
    
    if (type === 'block') {
      const { timelineData } = this.props;
      const timelineDuration = get(timelineData, 'duration');
      data.outTime = Math.min(data.inTime + 3000, timelineDuration);
    }
    
    this.setState({
      modalType: type,
      modalValue: data,
      modalAction: 'add',
    });
  }

  onMouseMove = (e) => {
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

      this.doSave(timelineData);
    }
  }

  onMouseUp = (e) => {
    this.setState({
      adjustBlockData: null,
      adjustBlockMode: null,
    });
  }

  onDeleteItem = (itemData) => {
    const layer = this.findItemLayer(itemData);
    const { timelineData } = this.props;

    timelineData.layers[Number(layer)] = timelineData.layers[Number(layer)].filter((item) => {
      return item.id != itemData.id;
    });

    this.doSave(timelineData);
  }

  onDeleteLayer = (index) => {
    const { timelineData } = this.props;

    timelineData.layers = timelineData.layers.filter((layer, layerIndex) => {
      return layerIndex != index;
    });

    this.doSave(timelineData);
  }

  onTimelineClick = (e) => {
    e.preventDefault();

    const { onStatusUpdate } = this.props;
    const newPosition = this.getTimelinePositionFromEvent(e);
    onStatusUpdate({
      position: newPosition,
    });
  }

  getTimelinePositionFromEvent = (e, round = true) => {
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

  doSave = (timelineData) => {
    // temp!
    const { doUpdateCurrentTimeline } = this.props;
    doUpdateCurrentTimeline(timelineData);
  }

  renderTimelineLayer = (layer, index, layers) => {
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
        onDeleteItem={this.onDeleteItem}
        onEditItem={this.onEditItem}
        onAdjustItem={this.onAdjustItem}
        onCopyItem={this.onCopyItem}
        onPasteItem={this.onPasteItem}
        onAddItemAt={this.onAddItemAt}
      />
    );
  }

  renderTimelineTracker = () => {
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

  renderTimeline = (data) => {
    const { zoom } = data;
    const layers = get(data, 'layers', []);
    
    return (
      <div
        className={styles.timeline}
        style={{
          width: percentString(zoom),
        }}
      >
      { layers.length ? layers.map(this.renderTimelineLayer) : null }
      { layers.length ? this.renderTimelineTracker() : null }
      </div>
    );
  }

  renderSave = () => {
    return (
      <Button
        bsSize="xsmall"
        onClick={this.onSaveClick}
      >
        Save
      </Button>
    );
  }
  
  renderTimelineControls = () => {
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

  renderAddItems = () => {
    return (
      <DropdownButton
        id="timeline-items-menu"
        title={(
          <Glyphicon
            glyph="plus"
          />
        )}
        bsSize="xsmall"
        onClick={stopEvent}
      >
        <MenuItem
          onSelect={this.onAddLayerClick}
        >
          Add layer
        </MenuItem>
        <MenuItem
          divider
        />
        <MenuItem
          onSelect={this.onAddBlockClick}
        >
          Add block...
        </MenuItem>
        <MenuItem
          onSelect={this.onAddTriggerClick}
        >
          Add trigger...
        </MenuItem>
      </DropdownButton>
    );
  }
  
  renderZoomControl = () => {
    const levels = [1, 1.5, 3, 6, 8, 10];
    const { timelineData } = this.props;
    const { zoom } = timelineData;
    
    return (
      <DropdownButton
        id="timeline-zoom-menu"
        title={(
          <Glyphicon
            glyph="search"
          />
        )}
        bsSize="xsmall"
        onClick={stopEvent}
      >
        { levels.map((level) => (
          <MenuItem
            key={`zoom-level-${level}`}
            onSelect={() => this.onZoomLevelClick(level)}
            active={level == zoom}
          >
            { percentString(level, true) }
          </MenuItem>
        )) }
      </DropdownButton>
    );
  }
  
  renderItemModals = () => {
    const { timelineData, scripts } = this.props;
    const { modalType, modalValue, modalAction } = this.state;
    return (
      <div>
        <TimelineBlockModal
          initialValue={modalValue}
          show={modalType === 'block'}
          title={modalAction === 'add' ? 'Add block' : 'Edit block'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          scripts={scripts}
          layers={get(timelineData, 'layers')}
        />
        <TimelineTriggerModal
          initialValue={modalValue}
          show={modalType === 'trigger'}
          title={modalAction === 'add' ? 'Add trigger' : 'Edit trigger'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          layers={get(timelineData, 'layers')}
        />
      </div>
    );
  }

  render = () => {
    const { timelineData } = this.props;
    const { adjustBlockData } = this.state;

    return (
      <Panel
        title="Timeline editor"
        className={styles.fullHeight}
        headingContent={
          timelineData && (
            <ButtonToolbar>
              { this.renderSave() }
              { this.renderTimelineControls() }
              { this.renderAddItems() }
              { this.renderZoomControl() }
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
          { timelineData ? this.renderTimeline(timelineData) : null }
        </div>
        { timelineData ? this.renderItemModals() : null }
      </Panel>
    );
  }
}

TimelineEditor.propTypes = propTypes;
TimelineEditor.defaultProps = defaultProps;

const mapStateToProps = ({currentTimeline, scripts}) => {
  return {
    timelineData: currentTimeline,
    scripts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateCurrentTimeline: (data) => dispatch(updateCurrentTimeline(data)),
    doUpdateTimelineInfo: (data) => dispatch(updateTimelineInfo(data)),
    doSaveTimeline: (data) => dispatch(saveTimeline(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineEditor);
