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
    
    if (deviceModalAction === 'add' || deviceModalAction === 'duplicate') {
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
    
    if (scriptModalAction === 'add' || scriptModalAction === 'duplicate') {
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
    
    if (timelineModalAction === 'add' || timelineModalAction === 'duplicate') {
      doCreateTimeline(data);
    } else if (timelineModalAction === 'edit') {
      doUpdateTimeline(data);
    }
    
    doCancelTimelineModal();
  }
  
  renderDeviceModal = () => {
    const { deviceModalAction, deviceModalValue } = this.props;
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