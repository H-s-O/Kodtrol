import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { createDevice, updateDevice} from '../../../../common/js/store/actions/devices';
import { createScript, updateScript } from '../../../../common/js/store/actions/scripts';
import { updateDeviceModal, updateScriptModal } from '../../../../common/js/store/actions/modals';
import DeviceModal from '../modals/DeviceModal';
import ScriptModal from '../modals/ScriptModal';

class ModalsContainer extends PureComponent {
  onDeviceModalCancel = () => {
    this.doCancelModal('Device');
  }

  onDeviceModalSuccess = (deviceData) => {
    this.doModalSuccess('Device', deviceData);
  }
  
  onScriptModalCancel = () => {
    this.doCancelModal('Script');
  }

  onScriptModalSuccess = (scriptData) => {
    this.doModalSuccess('Script', scriptData);
  }
  
  doCancelModal = (type) => {
    const cancelModal = this.props[`doCancel${type}Modal`];
    console.log(cancelModal);
    cancelModal();
  }
  
  doModalSuccess = (type, data) => {
    const { modals } = this.props;
    const action = modals[`${type.toLowerCase()}ModalAction`];
    
    if (action === 'add') {
      const createType = this.props[`doCreate${type}`];
      createType(deviceData);
    } else if (action === 'edit') {
      const updateType = this.props[`doUpdate${type}`];
      updateType(deviceData);
    }
    
    this.doCancelModal(type);
  }
  
  renderDeviceModal = () => {
    const { modals } = this.props;
    const { deviceModalAction, deviceModalValue } = modals;
    
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
    const { modals, devices } = this.props;
    const { scriptModalAction, scriptModalValue } = modals;
    
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
  
  render = () => {
    return (
      <div>
        { this.renderDeviceModal() }
        { this.renderScriptModal() }
      </div>
    )
  }
}

const mapStateToProps = ({modals, devices}) => {
  return {
    modals,
    devices,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doCreateDevice: (data) => createDevice(data),
    doUpdateDevice: (data) => updateDevice(data),
    doCancelDeviceModal: () => updateDeviceModal(),
    doCreateScript: (data) => createScript(data),
    doUpdateScript: (data) => updateScript(data),
    doCancelScriptModal: () => updateScriptModal(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsContainer);
