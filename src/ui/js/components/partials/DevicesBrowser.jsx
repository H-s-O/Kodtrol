import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import DeviceModal from '../modals/DeviceModal';
import stopEvent from '../../lib/stopEvent';
import { createDevice, updateDevice } from '../../../../common/js/store/actions/devices';

import styles from '../../../styles/components/partials/devicesbrowser.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onDeviceCreate: PropTypes.func,
};

const defaultProps = {
  value: [],
  onDeviceCreate: null,
};

class DevicesBrowser extends PureComponent {
  state = {
    modalAction: null,
    modalValue: null,
  };
  
  onAddClick = () => {
    this.setState({
      modalAction: 'add',
      modalValue: {
        id: uniqid(), // generate new device id
      }
    });
  }
  
  onEditDeviceClick = () => {
    this.setState({
      modalAction: 'edit',
      modalValue: {}, // temp
    });
  }

  onModalCancel = () => {
    this.setState({
      modalAction: null,
    });
  }

  onModalSuccess = (deviceData) => {
    const { dispatch } = this.props;
    const { modalAction } = this.state;
    
    if (modalAction === 'add') {
      dispatch(createDevice(deviceData));
    } else if (modalAction === 'edit') {
      dispatch(updateDevice(deviceData));
    }
    
    this.setState({
      modalAction: null,
    });
  }

  renderModal = () => {
    const { modalAction, modalValue } = this.state;
    return (
      <DeviceModal
        initialValue={modalValue}
        show={modalAction !== null}
        title={modalAction === 'add' ? 'Add device' : 'Edit device'}
        onCancel={this.onModalCancel}
        onSuccess={this.onModalSuccess}
      />
    );
  }

  render = () => {
    const { value } = this.props;
    return (
      <Panel
        title="Devices"
        className={styles.fullHeight}
        headingContent={
          <div
            className="pull-right"
          >
            <Button
              bsSize="xsmall"
              onClick={this.onAddClick}
            >
              <Glyphicon
                glyph="plus"
              />
            </Button>
          </div>
        }
      >
        <TreeView
          style={{
            overflowX: 'visible',
            overflowY: 'auto',
            height: '94%',
          }}
          value={value}
          onClickItem={this.onScriptSelect}
          actions={(
            <div
              className="pull-right"
            >
              <Button
                bsSize="xsmall"
                onClick={(e) => {stopEvent(e); this.onEditDeviceClick()}}
              >
                <Glyphicon
                  glyph="cog"
                />
              </Button>
            </div>
          )}
        />
        { this.renderModal() }
      </Panel>
    );
  }
};

DevicesBrowser.propTypes = propTypes;
DevicesBrowser.defaultProps = defaultProps;

export default connect()(DevicesBrowser);
