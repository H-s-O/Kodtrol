import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, ButtonGroup, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
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
  doDuplicateDeviceModal: PropTypes.func.isRequired,
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
  
  onDuplicateClick = (id) => {
    const { doDuplicateDeviceModal, devices } = this.props;
    const data = devices.find(it => it.id === id);
    doDuplicateDeviceModal(data);
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
      <Fragment
      >
        <ButtonGroup>
          <Button
            bsSize="xsmall"
            onClick={(e) => {stopEvent(e); this.onDuplicateClick(it.id)}}
          >
            <Glyphicon
              glyph="duplicate"
            />
          </Button>
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
        </ButtonGroup>
      </Fragment>
    );
  }
  
  renderTreeTags = (it) => {
    const { groups, output } = it;
    const tags = [];
    
    if (!output) {
      tags.push(
        <Label
          key="tag1"
          bsSize="xsmall"
          bsStyle="warning"
          title="No output assigned"
        >
        <Glyphicon
          glyph="warning-sign"
        />
        </Label>
      );
    }
    
    if (groups) { 
      tags.push(
        <Label
          key="tag2"
          bsSize="xsmall"
        >
          { groups }
        </Label>
      );
    }
    
    return tags;
  }

  render = () => {
    const { devices } = this.props;
    return (
      <Panel
        title="Devices"
        className={styles.fullHeight}
        data-screenshot-id="devices-browser"
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
          className={styles.wrapper}
          value={devices.map(({id, name, groups, output}) => ({
            id,
            label: name,
            icon: 'modal-window',
            groups,
            output,
          }))}
          onClickItem={this.onScriptSelect}
          renderActions={this.renderTreeActions}
          renderTags={this.renderTreeTags}
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
    doDuplicateDeviceModal: (data) => dispatch(updateDeviceModal('duplicate', data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesBrowser);
