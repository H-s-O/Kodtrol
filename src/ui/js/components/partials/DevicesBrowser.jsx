import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteDevice } from '../../../../common/js/store/actions/devices';
import { updateDeviceModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/devicesbrowser.scss';

const propTypes = {
  devices: PropTypes.arrayOf(PropTypes.shape({})),
  doDeleteDevice: PropTypes.func.isRequired,
  doCreateDeviceModal: PropTypes.func.isRequired,
  doEditDeviceModal: PropTypes.func.isRequired,
};

const defaultProps = {
  devices: [],
};

class DevicesBrowser extends PureComponent {
  onAddClick = () => {
    const { doCreateDeviceModal } = this.props;
    doCreateDeviceModal();
  }
  
  onEditClick = (id) => {
    const { doEditDeviceModal, devices } = this.props;
    const data = devices.find(it => it.id === id);
    doEditDeviceModal(data);
  }
  
  onDeleteClick = (id) => {
    deleteWarning(`Are you sure you want to delete this device ?`, (result) => {
      if (result) {
        const { doDeleteDevice } = this.props;
        doDeleteDevice(id);
      }
    });
  }

  renderTreeActions = (it) => {
    return (
      <div
        className="pull-right"
      >
        <Button
          bsSize="xsmall"
          onClick={(e) => {stopEvent(e); this.onEditClick(it.id)}}
        >
          <Glyphicon
            glyph="cog"
          />
        </Button>
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          onClick={(e) => {stopEvent(e); this.onDeleteClick(it.id)}}
        >
          <Glyphicon
            glyph="trash"
          />
        </Button>
      </div>
    );
  }

  render = () => {
    const { devices } = this.props;
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
          value={devices.map(({id, name}) => ({
            id,
            label: name,
            icon: 'modal-window',
          }))}
          onClickItem={this.onScriptSelect}
          renderActions={this.renderTreeActions}
        />
      </Panel>
    );
  }
};

DevicesBrowser.propTypes = propTypes;
DevicesBrowser.defaultProps = defaultProps;

const mapStateToProps = ({devices}) => {
  return {
    devices,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doDeleteDevice: (id) => dispatch(deleteDevice(id)),
    doCreateDeviceModal: () => dispatch(updateDeviceModal('add', {})),
    doEditDeviceModal: (data) => dispatch(updateDeviceModal('edit', data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesBrowser);
