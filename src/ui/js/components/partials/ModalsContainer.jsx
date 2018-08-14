import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { createDevice, updateDevice} from '../../../../common/js/store/actions/devices';
import { createScript, updateScript } from '../../../../common/js/store/actions/scripts';
import { createTimeline, updateTimeline } from '../../../../common/js/store/actions/timelines';
import { updateDeviceModal, updateScriptModal, updateTimelineModal } from '../../../../common/js/store/actions/modals';
import DeviceModal from '../modals/DeviceModal';
import ScriptModal from '../modals/ScriptModal';
import TimelineModal from '../modals/TimelineModal';

class ModalsContainer extends PureComponent {
  onDeviceModalCancel = () => {
    const { doCancelDeviceModal } = this.props;
    doCancelDeviceModal();
  }

  onDeviceModalSuccess = (data) => {
    const {
      deviceModalAction,
      doCreateDevice,
      doUpdateDevice,
      doCancelDeviceModal,
    } = this.props;
    
    if (deviceModalAction === 'add') {
      doCreateDevice(data);
    } else if (deviceModalAction === 'edit') {
      doUpdateDevice(data);
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
      doUpdateScript,
      doCancelScriptModal,
    } = this.props;
    
    if (scriptModalAction === 'add') {
      doCreateScript(data);
    } else if (scriptModalAction === 'edit') {
      doUpdateScript(data);
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
      doUpdateTimeline,
      doCancelTimelineModal,
    } = this.props;
    
    if (timelineModalAction === 'add') {
      doCreateTimeline(data);
    } else if (timelineModalAction === 'edit') {
      doUpdateTimeline(data);
    }
    
    doCancelTimelineModal();
  }
  
  renderDeviceModal = () => {
    const { deviceModalAction, deviceModalValue } = this.props;
    
    return (
      <DeviceModal
        initialValue={deviceModalValue}
        show={!!deviceModalAction}
        title={deviceModalAction === 'add' ? 'Add device' : 'Edit device'}
        onCancel={this.onDeviceModalCancel}
        onSuccess={this.onDeviceModalSuccess}
      />
    );
  }
  
  renderScriptModal = () => {
    const { scriptModalAction, scriptModalValue, devices } = this.props;
    
    return (
      <ScriptModal
        initialValue={scriptModalValue}
        show={!!scriptModalAction}
        title={scriptModalAction === 'add' ? 'Add script' : 'Edit script'}
        onCancel={this.onScriptModalCancel}
        onSuccess={this.onScriptModalSuccess}
        devices={devices}
      />
    );
  }
  
  renderTimelineModal = () => {
    const { timelineModalAction, timelineModalValue } = this.props;
    
    return (
      <TimelineModal
        initialValue={timelineModalValue}
        show={!!timelineModalAction}
        title={timelineModalAction === 'add' ? 'Add timeline' : 'Edit timeline'}
        onCancel={this.onTimelineModalCancel}
        onSuccess={this.onTimelineModalSuccess}
      />
    );
  }
  
  render = () => {
    return (
      <div>
        { this.renderDeviceModal() }
        { this.renderScriptModal() }
        { this.renderTimelineModal() }
      </div>
    )
  }
}

const mapStateToProps = ({modals, devices}) => {
  const {
    deviceModalAction,
    deviceModalValue,
    scriptModalAction,
    scriptModalValue,
    timelineModalAction,
    timelineModalValue,
  } = modals;

  return {
    deviceModalAction,
    deviceModalValue,
    scriptModalAction,
    scriptModalValue,
    timelineModalAction,
    timelineModalValue,
    devices,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doCreateDevice: (data) => dispatch(createDevice(data)),
    doUpdateDevice: (data) => dispatch(updateDevice(data)),
    doCancelDeviceModal: () => dispatch(updateDeviceModal()),
    doCreateScript: (data) => dispatch(createScript(data)),
    doUpdateScript: (data) => dispatch(updateScript(data)),
    doCancelScriptModal: () => dispatch(updateScriptModal()),
    doCreateTimeline: (data) => dispatch(createTimeline(data)),
    doUpdateTimeline: (data) => dispatch(updateTimeline(data)),
    doCancelTimelineModal: () => dispatch(updateTimelineModal()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsContainer);
