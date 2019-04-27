import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Glyphicon, SplitButton, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Panel from '../partials/Panel';
import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import TimelineTriggerModal from '../modals/TimelineTriggerModal';
import RecordTriggerModal from '../modals/RecordTriggerModal';
import TimelineBlockModal from '../modals/TimelineBlockModal';
import TimelineCurveModal from '../modals/TimelineCurveModal';
import RecordBlockModal from '../modals/RecordBlockModal';
import TimelineAudioTrackModal from '../modals/TimelineAudioTrackModal';
import TimelineBlock from './TimelineBlock';
import TimelineTrigger from './TimelineTrigger';
import TimelineCurve from './TimelineCurve';
import TimelineAudioTrack from './TimelineAudioTrack';
import { saveTimeline, runTimeline, stopTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineInfo, updateTimelineInfoUser } from '../../../../common/js/store/actions/timelineInfo';
import { Provider } from './timelineEditorContext';
import TimelineWrapper from './TimelineWrapper';

import styles from '../../../styles/components/timeline/timelineeditor.scss';

const propTypes = {
  currentTimeline: PropTypes.string,
  timelineData: PropTypes.shape({}),
  timelineInfo: PropTypes.shape({}),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doUpdateTimelineInfo: PropTypes.func.isRequired,
  doUpdateTimelineInfoUser: PropTypes.func.isRequired,
  doSaveTimeline: PropTypes.func.isRequired,
  doRunTimeline: PropTypes.func.isRequired,
  doStopRunTimeline: PropTypes.func.isRequired,
};

const defaultProps = {
  currentTimeline: null,
  timelineData: null,
  timelineInfo: null,
  scripts: [],
};

class TimelineEditor extends PureComponent {
  editorCallbacks = null;
  timelineWrapper = null;
  layerEditor = null;
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
      timelineCanPasteItem: this.canPasteItem,
      timelineUpdatePosition: this.onTimelineUpdatePosition,
    };
  }
  
  componentDidMount = () => {
    window.onkeydown = this.onKeyDown;
  }
  
  componentWillUnmount = () => {
    window.onkeydown = null;
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
      items: newItems,
    };
    
    this.doSave(newTimelineData);
  }
  
  onDeleteItem = (itemId) => {
    const { timelineData } = this.props;
    const { items } = timelineData;

    const newItems = items.filter(({id}) => id !== itemId);
    const newTimelineData = {
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
    this.layerEditor.doAddLayer('max');
  }
  
  onAddLayerAtBottomClick = () => {
    this.layerEditor.doAddLayer('min');
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
    // const { timelineData, doSaveTimeline, currentTimeline } = this.props;
    // doSaveTimeline(currentTimeline, timelineData);
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
    } else if (e.key === ' ') {
      const { timelineInfo, runTimeline } = this.props;
      const { playing } = timelineInfo;
      
      if (runTimeline !== null) {
        if (playing) {
          this.doPauseTimeline();
        } else {
          this.doPlayTimeline();
        }
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
  
  onAddAudioTrackClick = () => {
    this.doAddItem('audioTrack', {
      id: uniqid(), // generate new audio track id
      volume: 1,
    });
  }

  doAddItem = (type, baseData) => {
    this.setState({
      modalType: type,
      modalValue: baseData,
      modalAction: 'add',
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
    const data = {
      zoom: level,
    };
    this.doSave(data);
  }
  
  onZoomVertLevelClick = (level) => {
    const data = {
      zoomVert: level,
    };
    this.doSave(data);
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
  
  canPasteItem = (mode) => {
    const { copyItemData } = this.state;
    if (copyItemData === null) {
      return false;
    } else if (mode === '*' && typeof copyItemData === 'object') {
      return true;
    } else if (mode !== '*' && typeof copyItemData === 'number') {
      return true;
    }
    return false;
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

  onPasteItemHere = (layerId, e) => {
    //this.onPasteItem(layerId, '*', e); // @TODO
  }

  onAddBlockHereClick = (layerId, e) => {
    this.onAddItemAt(layerId, 'block', e);
  }
  
  onAddTriggerHereClick = (layerId, e) => {
    this.onAddItemAt(layerId, 'trigger', e);
  }
  
  onAddCurveHereClick = (layerId, e) => {
    this.onAddItemAt(layerId, 'curve', e);
  }
  
  onAddAudioTrackHereClick = (layerId, e) => {
    this.onAddItemAt(layerId, 'audioTrack', e);
  }
  
  onAddItemAt = (layerId, type, e) => {
    const data = {
      layer: layerId,
      id: uniqid(), // generate new item id
      inTime: this.getTimelinePositionFromEvent(e),
    };
    
    if (type === 'block' || type === 'curve' || type === 'audioTrack') {
      const { timelineData } = this.props;
      const timelineDuration = get(timelineData, 'duration');
      data.outTime = Math.min(data.inTime + 10000, timelineDuration);
    }
    if (type === 'audioTrack') {
      data.volume = 1;
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
    const { doSaveTimeline, currentTimeline } = this.props;
    doSaveTimeline(currentTimeline, timelineData);
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
    this.doPlayTimeline();
  }
  
  doPlayTimeline = () => {
    const { timelineInfo } = this.props;
    
    const newInfo = {
      ...timelineInfo,
      playing: true,
    };
    
    this.doUpdateInfo(newInfo);
  }
  
  onTimelinePauseClick = () => {
    this.doPauseTimeline();
  }
  
  doPauseTimeline = () => {
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
    
    const { playing } = timelineInfo;
    
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
    const { items, layers } = timelineData;
    
    const canAddItems = layers && layers.length;
    
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
          disabled={!canAddItems}
        >
          Add block...
        </MenuItem>
        <MenuItem
          onSelect={this.onAddTriggerClick}
          disabled={!canAddItems}
        >
          Add trigger...
        </MenuItem>
        <MenuItem
          onSelect={this.onAddCurveClick}
          disabled={!canAddItems}
        >
          Add curve...
        </MenuItem>
        <MenuItem
          onSelect={this.onAddAudioTrackClick}
          disabled={!canAddItems}
        >
          Add audio track...
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
  
  renderZoomControls = () => {
    const levels = [1, 1.5, 3, 6, 8, 10];
    const { timelineData } = this.props;
    const { zoom, zoomVert } = timelineData;
    
    return (
      <ButtonGroup>
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
        <DropdownButton
          id="timeline-zoom-vert-menu"
          title={(
            <Fragment>
              <Glyphicon
                glyph="search"
                />
              <Glyphicon
                glyph="resize-vertical"
                />
            </Fragment>
          )}
          bsSize="xsmall"
          onClick={stopEvent}
          >
          { levels.map((level) => (
            <MenuItem
              key={`zoom-vert-level-${level}`}
              onSelect={() => this.onZoomVertLevelClick(level)}
              active={level == zoomVert}
              >
              { percentString(level, true) }
            </MenuItem>
          )) }
        </DropdownButton>
      </ButtonGroup>
    );
  }

  renderItemComponent = (item, index, items) => {
    let ComponentClass = null;
    if ('script' in item) {
      ComponentClass = TimelineBlock;
    } else if ('trigger' in item) {
      ComponentClass = TimelineTrigger;
    } else if ('curve' in item) {
      ComponentClass = TimelineCurve;
    } else if ('file' in item) {
      ComponentClass = TimelineAudioTrack;
    }
    
    if (ComponentClass === null) {
      return null;
    }

    const { timelineData } = this.props;
    const { duration } = timelineData;
    const { inTime, outTime } = item;

    const leftPercent = (inTime / duration);
    const widthPercent = outTime ? ((outTime - inTime) / duration) : null;

    return (
      <ComponentClass
        key={`item-${index}`}
        data={item}
        style={{
          left: percentString(leftPercent),
          width: percentString(widthPercent),
        }}
      />
    );
  }

  renderLayerContextMenu = (baseTemplate, layerId, e) => {
    const template = [
      {
        type: 'separator',
      },
      {
        label: 'Paste item here',
        click: () => this.onPasteItemHere(layerId, e),
        enabled: this.canPasteItem('*'),
      },
      {
        label: 'Add block here...',
        click: () => this.onAddBlockHereClick(layerId, e),
      },
      {
        label: 'Add trigger here...',
        click: () => this.onAddTriggerHereClick(layerId, e),
      },
      {
        label: 'Add curve here...',
        click: () => this.onAddCurveHereClick(layerId, e),
      },
      {
        label: 'Add audio track here...',
        click: () => this.onAddAudioTrackHereClick(layerId, e),
      },
    ];

    return [
      ...baseTemplate,
      ...template
    ];
  }
  
  setTimelineWrapperRef = (ref) => {
    this.timelineWrapper = ref;
  }

  setLayerEditorRef = (ref) => {
    this.layerEditor = ref;
  }
  
  renderTimelineWrapper = (workingTimelineData) => {
    const { timelineInfo } = this.props;
    
    return (
      <div
        className={styles.timelineEditorContent}
      >
        <Provider
          value={this.editorCallbacks}
        >
          <TimelineWrapper
            ref={this.setTimelineWrapperRef}
            layerEditorRef={this.setLayerEditorRef}
            layerEditorRenderItemComponent={this.renderItemComponent}
            layerEditorRenderLayerContextMenu={this.renderLayerContextMenu}
            layerEditorOnChange={this.doSave}
            timelineData={workingTimelineData}
            timelineInfo={timelineInfo}
          />
        </Provider>
      </div>
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
              { this.renderZoomControls() }
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

const timelineDataSelector = createSelector(
  [
    (state) => state.currentTimeline,
    (state) => state.timelines,
  ],
  (currentTimeline, timelines) => {
    if (currentTimeline === null) {
      return null;
    }
    return timelines.find(({id}) => id === currentTimeline);
  }
);
const mapStateToProps = (state) => {
  return {
    currentTimeline: state.currentTimeline,
    timelineData: timelineDataSelector(state),
    scripts: state.scripts,
    timelineInfo: state.timelineInfo,
    runTimeline: state.runTimeline,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateTimelineInfo: (data) => dispatch(updateTimelineInfo(data)),
    doUpdateTimelineInfoUser: (data) => dispatch(updateTimelineInfoUser(data)),
    doSaveTimeline: (id, data) => dispatch(saveTimeline(id, data)),
    doRunTimeline: (id) => dispatch(runTimeline(id)),
    doStopRunTimeline: () => dispatch(stopTimeline()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineEditor);
