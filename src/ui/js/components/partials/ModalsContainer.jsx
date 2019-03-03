import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { saveOutputs } from '../../../../common/js/store/actions/outputs';
import { saveInputs } from '../../../../common/js/store/actions/inputs';
import { createDevice, saveDevice } from '../../../../common/js/store/actions/devices';
import { createScript, saveScript } from '../../../../common/js/store/actions/scripts';
import { createTimeline, saveTimeline } from '../../../../common/js/store/actions/timelines';
import { createBoard, saveBoard } from '../../../../common/js/store/actions/boards';
import { updateDeviceModal, updateScriptModal, updateTimelineModal, updateBoardModal, updateConfigModal } from '../../../../common/js/store/actions/modals';
import DeviceModal from '../modals/DeviceModal';
import ScriptModal from '../modals/ScriptModal';
import TimelineModal from '../modals/TimelineModal';
import BoardModal from '../modals/BoardModal';
import ConfigModal from '../modals/ConfigModal';

class ModalsContainer extends PureComponent {
  onDeviceModalCancel = () => {
    const { doCancelDeviceModal } = this.props;
    doCancelDeviceModal();
  }

  onDeviceModalSuccess = (data) => {
    const {
      deviceModalAction,
      doCreateDevice,
      doSaveDevice,
      doCancelDeviceModal,
    } = this.props;
    
    if (deviceModalAction === 'add' || deviceModalAction === 'duplicate') {
      doCreateDevice(data);
    } else if (deviceModalAction === 'edit') {
      const { id, ...deviceData } = data;
      doSaveDevice(id, deviceData);
    }
    
    doCancelDeviceModal();
  }
  
  onScriptModalCancel = () => {
    const { doCancelScriptModal } = this.props;
    doCancelScriptModal();
  }

  onScriptModalSuccess = (data) => {
    const {
      scriptModalAction,
      doCreateScript,
      doSaveScript,
      doCancelScriptModal,
    } = this.props;
    
    if (scriptModalAction === 'add' || scriptModalAction === 'duplicate') {
      doCreateScript(data);
    } else if (scriptModalAction === 'edit') {
      const { id, ...scriptData } = data;
      doSaveScript(id, scriptData);
    }
    
    doCancelScriptModal();
  }
  
  onTimelineModalCancel = () => {
    const { doCancelTimelineModal } = this.props;
    doCancelTimelineModal();
  }

  onTimelineModalSuccess = (data) => {
    const {
      timelineModalAction,
      doCreateTimeline,
      doSaveTimeline,
      doCancelTimelineModal,
    } = this.props;
    
    if (timelineModalAction === 'add' || timelineModalAction === 'duplicate') {
      doCreateTimeline(data);
    } else if (timelineModalAction === 'edit') {
      const { id, ...timelineData } = data;
      doSaveTimeline(id, timelineData);
    }
    
    doCancelTimelineModal();
  }
  
  onBoardModalCancel = () => {
    const { doCancelBoardModal } = this.props;
    doCancelBoardModal();
  }

  onBoardModalSuccess = (data) => {
    const {
      boardModalAction,
      doCreateBoard,
      doSaveBoard,
      doCancelBoardModal,
    } = this.props;
    
    if (boardModalAction === 'add' || boardModalAction === 'duplicate') {
      doCreateBoard(data);
    } else if (boardModalAction === 'edit') {
      const { id, ...boardData } = data;
      doSaveBoard(id, boardData);
    }
    
    doCancelBoardModal();
  }
  
  onConfigModalCancel = () => {
    const { doCloseConfigModal } = this.props;
    doCloseConfigModal();
  }
  
  onConfigModalSuccess = (data) => {
    const {
      doSaveOutputs,
      doSaveInputs,
      doCloseConfigModal,
    } = this.props;
    const { outputs, inputs } = data;
    
    doSaveOutputs(outputs);
    doSaveInputs(inputs);
    
    doCloseConfigModal();
  }
  
  renderDeviceModal = () => {
    const { deviceModalAction, deviceModalValue, outputs } = this.props;
    const title = {
      add: 'Add device',
      edit: 'Edit device',
      duplicate: 'Duplicate device',
      null: null,
    }[deviceModalAction];
    
    return (
      <DeviceModal
        initialValue={deviceModalValue}
        show={!!deviceModalAction}
        title={title}
        onCancel={this.onDeviceModalCancel}
        onSuccess={this.onDeviceModalSuccess}
        outputs={outputs}
      />
    );
  }
  
  renderScriptModal = () => {
    const { scriptModalAction, scriptModalValue, devices } = this.props;
    const title = {
      add: 'Add script',
      edit: 'Edit script',
      duplicate: 'Duplicate script',
      null: null,
    }[scriptModalAction];
    
    return (
      <ScriptModal
        initialValue={scriptModalValue}
        show={!!scriptModalAction}
        title={title}
        onCancel={this.onScriptModalCancel}
        onSuccess={this.onScriptModalSuccess}
        devices={devices}
      />
    );
  }
  
  renderTimelineModal = () => {
    const { timelineModalAction, timelineModalValue } = this.props;
    const title = {
      add: 'Add timeline',
      edit: 'Edit timeline',
      duplicate: 'Duplicate timeline',
      null: null,
    }[timelineModalAction];
    
    return (
      <TimelineModal
        initialValue={timelineModalValue}
        show={!!timelineModalAction}
        title={title}
        onCancel={this.onTimelineModalCancel}
        onSuccess={this.onTimelineModalSuccess}
      />
    );
  }
  
  renderBoardModal = () => {
    const { boardModalAction, boardModalValue } = this.props;
    const title = {
      add: 'Add board',
      edit: 'Edit board',
      duplicate: 'Duplicate board',
      null: null,
    }[boardModalAction];
    
    return (
      <BoardModal
        initialValue={boardModalValue}
        show={!!boardModalAction}
        title={title}
        onCancel={this.onBoardModalCancel}
        onSuccess={this.onBoardModalSuccess}
      />
    );
  }
  
  renderConfigModal = () => {
    const { showConfigModal, outputs, inputs } = this.props;
    
    return (
      <ConfigModal
        show={showConfigModal}
        outputs={outputs}
        inputs={inputs}
        onCancel={this.onConfigModalCancel}
        onSuccess={this.onConfigModalSuccess}
      />
    );
  }
  
  render = () => {
    return (
      <div>
        { this.renderDeviceModal() }
        { this.renderScriptModal() }
        { this.renderTimelineModal() }
        { this.renderBoardModal() }
        { this.renderConfigModal() }
      </div>
    )
  }
}

const mapStateToProps = ({modals, devices, outputs, inputs}) => {
  const {
    deviceModalAction,
    deviceModalValue,
    scriptModalAction,
    scriptModalValue,
    timelineModalAction,
    timelineModalValue,
    boardModalAction,
    boardModalValue,
    showConfigModal,
  } = modals;

  return {
    deviceModalAction,
    deviceModalValue,
    scriptModalAction,
    scriptModalValue,
    timelineModalAction,
    timelineModalValue,
    boardModalAction,
    boardModalValue,
    showConfigModal,
    devices,
    outputs,
    inputs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doCreateDevice: (data) => dispatch(createDevice(data)),
    doSaveDevice: (id, data) => dispatch(saveDevice(id, data)),
    doCancelDeviceModal: () => dispatch(updateDeviceModal()),
    doCreateScript: (data) => dispatch(createScript(data)),
    doSaveScript: (id, data) => dispatch(saveScript(id, data)),
    doCancelScriptModal: () => dispatch(updateScriptModal()),
    doCreateTimeline: (data) => dispatch(createTimeline(data)),
    doSaveTimeline: (id, data) => dispatch(saveTimeline(id, data)),
    doCancelTimelineModal: () => dispatch(updateTimelineModal()),
    doCreateBoard: (data) => dispatch(createBoard(data)),
    doSaveBoard: (id, data) => dispatch(saveBoard(id, data)),
    doCancelBoardModal: () => dispatch(updateBoardModal()),
    doSaveOutputs: (data) => dispatch(saveOutputs(data)),
    doSaveInputs: (data) => dispatch(saveInputs(data)),
    doCloseConfigModal: () => dispatch(updateConfigModal()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsContainer);
