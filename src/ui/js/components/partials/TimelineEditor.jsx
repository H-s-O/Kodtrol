import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, set, unset } from 'lodash';
import { Button, Glyphicon, SplitButton, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import path from 'path';

import Panel from './Panel';
import percentString from '../../lib/percentString';
import stopEvent from '../../lib/stopEvent';
import TimelineTriggerModal from '../modals/TimelineTriggerModal';
import RecordTriggerModal from '../modals/RecordTriggerModal';
import TimelineBlockModal from '../modals/TimelineBlockModal';
import RecordBlockModal from '../modals/RecordBlockModal';
import TimelineAudioTrackModal from '../modals/TimelineAudioTrackModal';
import TimelineLayer from '../timeline/TimelineLayer';
import { updateCurrentTimeline, saveTimeline, runTimeline, stopTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineInfo, updateTimelineInfoUser } from '../../../../common/js/store/actions/timelineInfo';
import { importAudioFile } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  timelineData: PropTypes.shape({}),
  timelineInfo: PropTypes.shape({}),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doUpdateCurrentTimeline: PropTypes.func.isRequired,
  doUpdateTimelineInfo: PropTypes.func.isRequired,
  doUpdateTimelineInfoUser: PropTypes.func.isRequired,
  doSaveTimeline: PropTypes.func.isRequired,
  doRunTimeline: PropTypes.func.isRequired,
  doStopRunTimeline: PropTypes.func.isRequired,
};

const defaultProps = {
  timelineData: null,
  timelineInfo: null,
  scripts: [],
};

class TimelineEditor extends PureComponent {
  timelineContainer = null;
  timelineCursorTracker = null;
  
  state = {
    modalType: null,
    modalAction: null,
    modalValue: null,
    
    adjustItemPath: null,
    adjustItemMode: null,
    
    copyItemData: null,
    
    timelineDataTemp: null,
    
    recording: false,
    recordingData: null,
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
  
  onRecordClick = () => {
    const { recording } = this.state;
    if (!recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }
  
  startRecording = () => {
    const { timelineData, doRunTimeline } = this.props;
    const { id } = timelineData;
    
    this.setState({
      timelineDataTemp: {
        ...timelineData,
      },
      recording: true,
    });
    
    doRunTimeline(id);
    
    window.onkeydown = this.onKeyDown;
  }
  
  stopRecording = () => {
    const { doStopRunTimeline } = this.props;
    const { timelineDataTemp } = this.state;
    
    this.doSave(timelineDataTemp);
    
    this.setState({
      timelineDataTemp: null,
      recording: false,
    });
    
    doStopRunTimeline();
    
    window.onkeydown = null;
  }
  
  onKeyDown = (e) => {
    const { recording, timelineDataTemp, recordingData } = this.state;
    
    if (recording) {
      const { timelineInfo } = this.props;
      const { position } = timelineInfo;
      const { layer, ...itemData } = recordingData;
      
      if (e.key === 't') {
        timelineDataTemp.layers[layer].push({
          ...itemData,
          inTime: position,
          id: uniqid(),
        });
        this.setState({
          timelineDataTemp,
        });
        this.forceUpdate();
      }
    }
  }

  onAddLayerClick = () => {
    const { timelineData } = this.props;
    const newData = {
      ...timelineData,
      layers: [
        ...timelineData.layers,
        [],
      ],
    };
    this.doSave(newData);
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
  
  onAddAudioTrack = () => {
    importAudioFile((file) => {
      if (file) {
        const { timelineData } = this.props;
        const newData = {
          ...timelineData,
          layers: [
            ...timelineData.layers,
            [
              {
                id: uniqid(),
                name: path.basename(file),
                file,
                inTime: 0,
                outTime: 274000,
                volume: 1,
                color: "#000",
              },
            ],
          ],
        };
        this.doSave(newData);
      }
    });
  }

  onEditItem = (layerIndex, itemIndex) => {
    const { timelineData } = this.props;
    const itemData = get(timelineData, this.getPath(layerIndex, itemIndex));
    
    let type = null;
    if ('script' in itemData) {
      type = 'block';
    } else if ('trigger' in itemData) {
      type = 'trigger';
    } else if ('curve' in itemData) {
      type = 'curve';
    } else if ('file' in itemData) {
      type = 'audioTrack';
    }
    
    this.setState({
      modalType: type,
      modalValue: {
        ...itemData,
        layer: layerIndex, // add layer id
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
      modalAction: null,
      modalValue: null,
    });
  }
  
  onItemModalCancel = () => {
    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
    });
  }
  
  onSetRecordTriggerClick = () => {
    this.doSetRecord('trigger');
  }
  
  onSetRecordBlockClick = () => {
    this.doSetRecord('block');
  }
  
  doSetRecord = (type) => {
    this.setState({
      modalType: type,
      modalAction: 'record',
    });
  }
  
  onRecordModalSuccess = (recordData) => {
    this.setState({
      recordingData: recordData,
    });
    
    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
    });
  }

  onRecordModalCancel = () => {
    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
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
  
  getPath = (layerIndex, itemIndex = null, prop = null) => {
    let path = `layers[${layerIndex}]`;
    if (itemIndex !== null) {
      path += `[${itemIndex}]`;
    }
    if (prop !== null) {
      path += `.${prop}`;
    }
    return path;
  }
  
  onAdjustItem = (layerIndex, itemIndex, mode) => {
    const { timelineData } = this.props;
    this.setState({
      adjustItemMode: mode,
      adjustItemPath: this.getPath(layerIndex, itemIndex),
      timelineDataTemp: {
        ...timelineData
      },
    });
  }

  onCopyItem = (layerIndex, itemIndex, mode) => {
    const { timelineData } = this.props;
    const itemData = get(timelineData, this.getPath(layerIndex, itemIndex, mode));
    
    this.setState({
      copyItemData: itemData,
    });
  }

  onPasteItem = (layerIndex, itemIndex, mode) => {
    const { copyItemData } = this.state;
    if (copyItemData !== null) {
      const { timelineData } = this.props;
      const newData = set(timelineData, this.getPath(layerIndex, itemIndex, mode), copyItemData);

      this.doSave(newData);

      this.setState({
        copyItemData: null,
      });
    }
  }
  
  onAddItemAt = (layerIndex, type, e) => {
    const data = {
      layer: layerIndex,
      id: uniqid(), // generate new item id
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
    const { timelineData } = this.props;
    if (timelineData) {
      const cursorPos = this.getTimelineScreenXFromEvent(e);
      this.timelineCursorTracker.style = `left:${cursorPos}px`;
    }
    
    const { adjustItemPath, adjustItemMode } = this.state;
    if (adjustItemPath !== null) {
      const { timelineData } = this.props;
      const newValue = this.getTimelinePositionFromEvent(e);
      
      const newData = set(timelineData, `${adjustItemPath}.${adjustItemMode}`, newValue);

      this.setState({
        timelineDataTemp: newData,
      });
      this.forceUpdate(); // needed for live refresh of timeline
    }
  }

  onMouseUp = (e) => {
    const { timelineDataTemp } = this.state;
    
    this.doSave(timelineDataTemp);
    
    this.setState({
      adjustItemPath: null,
      adjustItemMode: null,
      timelineDataTemp: null,
    });
  }

  onDeleteItem = (layerIndex, itemIndex) => {
    const { timelineData } = this.props;
    unset(timelineData, this.getPath(layerIndex, itemIndex)); // derp

    this.doSave(timelineData);
  }

  onDeleteLayer = (layerIndex) => {
    const { timelineData } = this.props;
    unset(timelineData, this.getPath(layerIndex)); // derp

    this.doSave(timelineData);
  }

  onTimelineClick = (e) => {
    stopEvent(e);

    const { timelineInfo } = this.props;
    const newPosition = this.getTimelinePositionFromEvent(e);
    const newInfo = {
      ...timelineInfo,
      position: newPosition,
    };
    
    this.doUpdateInfo(newInfo);
  }

  getTimelinePositionFromEvent = (e, round = true) => {
    const { timelineData } = this.props;
    const duration = get(timelineData, 'duration');
    const zoom = get(timelineData, 'zoom');
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft, scrollWidth } = this.timelineContainer;
    const percent = (clientX - left + scrollLeft) / scrollWidth;
    let newPosition = (duration * percent);
    if (round) {
      newPosition = Math.round(newPosition);
    }
    return newPosition;
  }
  
  getTimelineScreenXFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft } = this.timelineContainer;
    const pos = (clientX - left + scrollLeft);
    return pos;
  }

  doSave = (timelineData) => {
    // temp!
    const { doUpdateCurrentTimeline } = this.props;
    doUpdateCurrentTimeline(timelineData);
  }
  
  onTimelineRewindClick = () => {
    const { timelineInfo } = this.props;
    const newInfo = {
      ...timelineInfo,
      position: 0,
    };
    this.doUpdateInfo(newInfo);
  }
  
  onTimelinePlayClick = () => {
    const { timelineInfo } = this.props;
    const newInfo = {
      ...timelineInfo,
      playing: true,
    };
    this.doUpdateInfo(newInfo);
  }
  
  onTimelinePauseClick = () => {
    const { timelineInfo } = this.props;
    const newInfo = {
      ...timelineInfo,
      playing: false,
    };
    this.doUpdateInfo(newInfo);
  }
  
  doUpdateInfo = (timelineInfo) => {
    const { doUpdateTimelineInfoUser } = this.props;
    doUpdateTimelineInfoUser(timelineInfo);
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
    const { timelineInfo, timelineData } = this.props;
    const { position } = timelineInfo;
    const { duration } = timelineData;
    
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
  
  renderTimelineCursorTracker = () => {
    return (
      <div
        ref={(ref) => this.timelineCursorTracker = ref}
        className={styles.timelineCursorTracker}
      >
      </div>
    )
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
      { this.renderTimelineCursorTracker() }
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
    const { timelineInfo } = this.props;
    if (!timelineInfo) {
      return null;
    }
    
    const { playing, position } = timelineInfo;
    
    return (
      <ButtonGroup>
        <Button
          bsSize="xsmall"
          onClick={this.onTimelineRewindClick}
        >
          <Glyphicon
            glyph="step-backward"
          />
        </Button>
        { !playing ? (
          <Button
            bsSize="xsmall"
            onClick={this.onTimelinePlayClick}
          >
            <Glyphicon
              glyph="play"
            />
          </Button>
        ) : (
          <Button
            bsSize="xsmall"
            onClick={this.onTimelinePauseClick}
          >
            <Glyphicon
              glyph="pause"
            />
          </Button>
        )}
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
        <MenuItem
          divider
        />
        <MenuItem
          onSelect={this.onAddAudioTrack}
        >
          Add audio track
        </MenuItem>
      </DropdownButton>
    );
  }
  
  renderRecordItems = () => {
    const { recording, recordingData } = this.state;
    
    return (
      <SplitButton
        id="timeline-record-menu"
        title={(
          <Glyphicon
            glyph="record"
          />
        )}
        bsSize="xsmall"
        bsStyle={recording ? 'danger' : 'default'}
        onClick={this.onRecordClick}
      >
        <MenuItem
          onSelect={this.onSetRecordTriggerClick}
        >
          Set recorded triggers...
        </MenuItem>
        { /*<MenuItem
          onSelect={this.onSetRecordBlockClick}
        >
          Set recorded blocks...
        </MenuItem> */}
      </SplitButton>
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
    const layers = get(timelineData, 'layers');
    
    return (
      <Fragment>
        <TimelineBlockModal
          initialValue={modalValue}
          show={modalType === 'block' && modalAction !== 'record'}
          title={modalAction === 'add' ? 'Add block' : 'Edit block'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          scripts={scripts}
          layers={layers}
        />
        <RecordBlockModal
          initialValue={{}}
          show={modalType === 'block' && modalAction === 'record'}
          title="Set recorded blocks"
          onCancel={this.onRecordModalCancel}
          onSuccess={this.onRecordModalSuccess}
          scripts={scripts}
          layers={layers}
        />
        <TimelineTriggerModal
          initialValue={modalValue}
          show={modalType === 'trigger' && modalAction !== 'record'}
          title={modalAction === 'add' ? 'Add trigger' : 'Edit trigger'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          layers={layers}
        />
        <RecordTriggerModal
          initialValue={{}}
          show={modalType === 'trigger' && modalAction === 'record'}
          title="Set recorded triggers"
          onCancel={this.onRecordModalCancel}
          onSuccess={this.onRecordModalSuccess}
          layers={layers}
        />
        <TimelineAudioTrackModal
          initialValue={modalValue}
          show={modalType === 'audioTrack'}
          title={modalAction === 'add' ? 'Add audio track' : 'Edit audio track'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          layers={layers}
        />
      </Fragment>
    );
  }

  render = () => {
    const { timelineData } = this.props;
    const { adjustItemPath, timelineDataTemp } = this.state;
    const workingTimelineData = timelineDataTemp || timelineData;

    return (
      <Panel
        title="Timeline editor"
        className={styles.fullHeight}
        headingContent={
          workingTimelineData && (
            <ButtonToolbar>
              { this.renderSave() }
              { this.renderTimelineControls() }
              { this.renderRecordItems() }
              { this.renderAddItems() }
              { this.renderZoomControl() }
            </ButtonToolbar>
          )
        }
      >
        <div
          ref={ (ref) => this.timelineContainer = ref }
          className={styles.wrapper}
          onClick={ this.onTimelineClick }
          onMouseMove={this.onMouseMove}
          onMouseUp={adjustItemPath ? this.onMouseUp : null}
        >
          { workingTimelineData ? this.renderTimeline(workingTimelineData) : null }
        </div>
        { workingTimelineData ? this.renderItemModals() : null }
      </Panel>
    );
  }
}

TimelineEditor.propTypes = propTypes;
TimelineEditor.defaultProps = defaultProps;

const mapStateToProps = ({currentTimeline, scripts, timelineInfo}) => {
  return {
    timelineData: currentTimeline,
    scripts,
    timelineInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateCurrentTimeline: (data) => dispatch(updateCurrentTimeline(data)),
    doUpdateTimelineInfo: (data) => dispatch(updateTimelineInfo(data)),
    doUpdateTimelineInfoUser: (data) => dispatch(updateTimelineInfoUser(data)),
    doSaveTimeline: (data) => dispatch(saveTimeline(data)),
    doRunTimeline: (id) => dispatch(runTimeline(id)),
    doStopRunTimeline: () => dispatch(stopTimeline()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineEditor);
