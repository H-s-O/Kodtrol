import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, set, unset } from 'lodash';
import { Button, Glyphicon, SplitButton, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import path from 'path';

import Panel from '../partials/Panel';
import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import TimelineTriggerModal from '../modals/TimelineTriggerModal';
import RecordTriggerModal from '../modals/RecordTriggerModal';
import TimelineBlockModal from '../modals/TimelineBlockModal';
import TimelineCurveModal from '../modals/TimelineCurveModal';
import RecordBlockModal from '../modals/RecordBlockModal';
import TimelineAudioTrackModal from '../modals/TimelineAudioTrackModal';
import { updateCurrentTimeline, saveTimeline, runTimeline, stopTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineInfo, updateTimelineInfoUser } from '../../../../common/js/store/actions/timelineInfo';
import { importAudioFile } from '../../lib/messageBoxes';
import { Provider } from './timelineEditorContext';
import TimelineWrapper from './TimelineWrapper';

import styles from '../../../styles/components/timeline/timelineeditor.scss';

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
  editorCallbacks = null;
  timelineWrapper = null;
  state = {
    modalType: null,
    modalAction: null,
    modalValue: null,
    
    adjustItemId: null,
    adjustItemMode: null,
    
    copyItemData: null,
    
    timelineDataTemp: null,
    
    recording: false,
    recordingData: null,
  };
  
  constructor(props) {
    super(props);
    
    this.editorCallbacks = {
      timelineAddItemAt: this.onAddItemAt,
      timelineEditItem: this.onEditItem,
      timelineUpdateItem: this.onUpdateItem,
      timelineAdjustItem: this.onAdjustItem,
      timelineDeleteItem: this.onDeleteItem,
      timelineCopyItem: this.onCopyItem,
      timelinePasteItem: this.onPasteItem,
      timelineAddLayer: this.onAddLayer,
      timelineDeleteLayer: this.onDeleteLayer,
      timelineUpdatePosition: this.onTimelineUpdatePosition,
    };
  }
  
  getItem = (itemId) => {
    const { timelineData } = this.props;
    const { items } = timelineData;
    return items.find(({id}) => id === itemId);
  }
  
  getLayer = (layerId) => {
    const { timelineData } = this.props;
    const { layers } = timelineData;
    return layers.find(({id}) => id === layerId);
  }
  
  onUpdateItem = (itemId, data) => {
    const { timelineData } = this.props;
    const { items } = timelineData;
    const itemData = this.getItem(itemId);
    
    const newItemData = {
      ...itemData,
      ...data,
    };
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return newItemData;
      }
      return item;
    });
    const newTimelineData = {
      ...timelineData,
      items: newItems,
    };
    
    this.doSave(newTimelineData);
  }
  
  onDeleteItem = (itemId) => {
    const { timelineData } = this.props;
    const { items } = timelineData;

    const newItems = items.filter(({id}) => id !== itemId);
    const newTimelineData = {
      ...timelineData,
      items: newItems,
    };
    
    this.doSave(newTimelineData);
  }
  
  onEditItem = (itemId) => {
    const itemData = this.getItem(itemId);
    
    let type;
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
      },
      modalAction: 'edit',
    });
  }
  
  onItemModalSuccess = (itemData) => {
    const { timelineData } = this.props;
    const { items } = timelineData;
    
    // Attempt to find item index if existing
    const itemIndex = items.findIndex(({id}) => id === itemData.id); 
    
    let newItems;
    // If item does not exists, add it
    if (itemIndex === -1) {
      newItems = [
        ...items,
        itemData,
      ];
    } 
    // Update existing item
    else {
      newItems = items.map((item) => {
        if (item.id === itemData.id) {
          return itemData;
        }
        return item;
      });
    }
    
    const newTimelineData = {
      ...timelineData,
      items: newItems,
    };
    
    // Save timeline
    this.doSave(newTimelineData);

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
  
  onAddLayerAtTopClick = () => {
    const { timelineData } = this.props;
    const { layers } = timelineData;
    this.onAddLayer(layers.length);
  }
  
  onAddLayerAtBottomClick = () => {
    this.onAddLayer(0);
  }

  onAddLayer = (index) => {
    const { timelineData } = this.props;
    const { layers } = timelineData;

    const newLayer = {
      id: uniqid(),
      order: index,
    };
    
    let newLayers = [...layers];
    if (index >= layers.length) {
      newLayers.push(newLayer);
    } else {
      newLayers.splice(index, 0, newLayer);
    }
    
    const newTimelineData = {
      ...timelineData,
      layers: newLayers,
    };
    
    this.doSave(newTimelineData);
  }
  
  onDeleteLayer = (layerId) => {
    const { timelineData } = this.props;
    const { layers, items } = timelineData;

    const newLayers = layers.filter(({id}) => id !== layerId);
    const newItems = items.filter(({layer}) => layer !== layerId);
    const newTimelineData = {
      ...timelineData,
      layers: newLayers,
      items: newItems,
    };
    
    this.doSave(newTimelineData);
  }
  
  getTimelinePositionFromEvent = (e, round = true) => {
    const percent = this.timelineWrapper.getTimelinePercentFromEvent(e);
    
    const { timelineData } = this.props;
    const { duration } = timelineData;
    
    let position = duration * percent;
    if (round) {
      position = Math.round(position);
    }
    return position;
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
      const { items } = timelineDataTemp;
      
      if (e.key === 't') {
        const newItem = {
          ...recordingData,
          inTime: position,
          id: uniqid(),
        };
        const newItems = [
          ...items,
          newItem,
        ];
        const newTimelineData = {
          ...timelineDataTemp,
          items: newItems,
        };

        this.setState({
          timelineDataTemp: newTimelineData,
        });
        // this.forceUpdate();
      }
    }
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
  
  onAddCurveClick = () => {
    this.doAddItem('curve', {
      id: uniqid(), // generate new curve id
      curve: [],
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
  
  
  onAdjustItem = (itemId, mode) => {
    const { timelineData } = this.props;
    
    this.setState({
      adjustItemMode: mode,
      adjustItemId: itemId,
      timelineDataTemp: {
        ...timelineData
      },
    });
    
    window.onmousemove = this.onMouseMove;
    window.onmouseup = this.onMouseUp;
  }
  
  onMouseMove = (e) => {
    const { adjustItemId, adjustItemMode } = this.state;
    
    if (adjustItemId !== null && adjustItemMode !== null) {
      const { timelineData } = this.props;
      const { items, duration } = timelineData;
      
      let newValue = this.getTimelinePositionFromEvent(e);
      if (newValue < 0) {
        newValue = 0;
      } else if (newValue > duration) {
        newValue = duration;
      }
      const newItems = items.map((item) => {
        if (item.id === adjustItemId) {
          return {
            ...item,
            [adjustItemMode]: newValue,
          };
        }
        return item;
      });
      const newTimelineData = {
        ...timelineData,
        items: newItems,
      };

      this.setState({
        timelineDataTemp: newTimelineData,
      });
      // this.forceUpdate(); // needed for live refresh of timeline, temp
    }
  }

  onCopyItem = (itemId, mode) => {
    const item = this.getItem(itemId);
    
    let itemData;
    if (mode === '*') {
      itemData = item;
    } else {
      itemData = item[mode];
    }

    this.setState({
      copyItemData: itemData,
    });
  }

  onPasteItem = (itemId, mode, e = null) => {
    const { copyItemData } = this.state;
    
    if (copyItemData !== null) {
      const { timelineData } = this.props;
      const { items, duration } = timelineData;
      
      let newItem;
      let newItems;
      if (mode === '*') {
        const { inTime, outTime } = copyItemData;
        let newInTime = this.getTimelinePositionFromEvent(e);
        if (newInTime < 0) {
          newInTime = 0;
        } else if (newInTime > duration) {
          newInTime = duration;
        }
        newItem = {
          ...copyItemData,
          id: uniqid(), // override with new id
          layer: itemId,
          inTime: newInTime,
        }
        if ('outTime' in copyItemData) {
          const diffTime = outTime - inTime;
          let newOutTime = newInTime + diffTime;
          if (newOutTime < 0) {
            newOutTime = 0;
          } else if (newOutTime > duration) {
            newOutTime = duration;
          }
          newItem.outTime = newOutTime;
        }
        newItems = [
          ...items,
          newItem,
        ];
      } else {
        const item = this.getItem(itemId);
        newItem = {
          ...item,
          [mode]: copyItemData,
        };
        newItems = items.map((item) => {
          if (item.id === itemId) {
            return newItem;
          }
          return item;
        });
      }
      const newTimelineData = {
        ...timelineData,
        items: newItems,
      };

      this.doSave(newTimelineData);

      this.setState({
        copyItemData: null,
      });
    }
  }
  
  onAddItemAt = (layerId, type, e) => {
    const data = {
      layer: layerId,
      id: uniqid(), // generate new item id
      inTime: this.getTimelinePositionFromEvent(e),
    };
    
    if (type === 'block' || type === 'curve') {
      const { timelineData } = this.props;
      const timelineDuration = get(timelineData, 'duration');
      data.outTime = Math.min(data.inTime + 10000, timelineDuration);
    }
    
    if (type === 'curve') {
      data.curve = [];
    }
    
    this.setState({
      modalType: type,
      modalValue: data,
      modalAction: 'add',
    });
  }


  onMouseUp = (e) => {
    console.log('timeline on mouse up');
    
    window.onmouseup = null;
    window.onmousemove = null;
    
    const { timelineDataTemp } = this.state;
    
    this.doSave(timelineDataTemp);
    
    this.setState({
      adjustItemId: null,
      adjustItemMode: null,
      timelineDataTemp: null,
    });
  }

  



  doSave = (timelineData) => {
    const { doUpdateCurrentTimeline } = this.props;
    doUpdateCurrentTimeline(timelineData);
  }
  
  ////////////////////////////////////////////////////////////////////////////
  // TIMELINE INFO
  
  onTimelineUpdatePosition = (e) => {
    const { timelineInfo } = this.props;
    
    const newPosition = this.getTimelinePositionFromEvent(e);
    const newInfo = {
      ...timelineInfo,
      position: newPosition,
    };
    
    this.doUpdateInfo(newInfo);
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

  ////////////////////////////////////////////////////////////////////////////
  // RENDERS
  
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
    const { timelineInfo, runTimeline } = this.props;
    if (!timelineInfo) {
      return null;
    }
    
    const { playing, position } = timelineInfo;
    
    return (
      <ButtonGroup>
        <Button
          disabled={runTimeline === null}
          bsSize="xsmall"
          onClick={this.onTimelineRewindClick}
        >
          <Glyphicon
            glyph="step-backward"
          />
        </Button>
        { !playing ? (
          <Button
            disabled={runTimeline === null}
            bsSize="xsmall"
            onClick={this.onTimelinePlayClick}
          >
            <Glyphicon
              glyph="play"
            />
          </Button>
        ) : (
          <Button
            disabled={runTimeline === null}
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
    const { timelineData } = this.props;
    const { items } = timelineData;
    
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
        { !items.length ? (
          <MenuItem
            onSelect={this.onAddLayerAtTopClick}
            >
            Add layer
          </MenuItem>
        ) : (
          <Fragment>
            <MenuItem
              onSelect={this.onAddLayerAtTopClick}
            >
              Add layer at top
            </MenuItem>
            <MenuItem
              onSelect={this.onAddLayerAtBottomClick}
            >
              Add layer at bottom
            </MenuItem>
          </Fragment>
        )}
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
          onSelect={this.onAddCurveClick}
        >
          Add curve...
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
          <Fragment>
            <Glyphicon
              glyph="search"
            />
            <Glyphicon
              glyph="resize-horizontal"
            />
          </Fragment>
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
  
  setTimelineWrapperRef = (ref) => {
    this.timelineWrapper = ref;
  }
  
  renderTimelineWrapper = (workingTimelineData) => {
    const { timelineInfo } = this.props;
    
    return (
      <Provider
        value={this.editorCallbacks}
      >
        <TimelineWrapper
          wrapperRef={this.setTimelineWrapperRef}
          timelineData={workingTimelineData}
          timelineInfo={timelineInfo}
        />
      </Provider>
    );
  }
  
  renderItemModals = () => {
    const { timelineData, scripts } = this.props;
    const { modalType, modalValue, modalAction } = this.state;
    const { layers } = timelineData;
    
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
        <TimelineCurveModal
          initialValue={modalValue}
          show={modalType === 'curve'}
          title={modalAction === 'add' ? 'Add curve' : 'Edit curve'}
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          layers={layers}
        />
      </Fragment>
    );
  }

  render = () => {
    const { timelineData } = this.props;
    const { timelineDataTemp } = this.state;
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
        { workingTimelineData ? this.renderTimelineWrapper(workingTimelineData) : null }
        { workingTimelineData ? this.renderItemModals() : null }
      </Panel>
    );
  }
}

TimelineEditor.propTypes = propTypes;
TimelineEditor.defaultProps = defaultProps;

const mapStateToProps = ({currentTimeline, scripts, timelineInfo, runTimeline}) => {
  return {
    timelineData: currentTimeline,
    scripts,
    timelineInfo,
    runTimeline,
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
