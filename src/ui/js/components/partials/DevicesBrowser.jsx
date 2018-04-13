import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { isFunction } from 'lodash';
import Panel from './Panel';
import TreeView from './TreeView';
import AddDevice from '../modals/AddDevice';

import styles from '../../../styles/components/partials/devicesbrowser.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onDeviceCreate: PropTypes.func,
};

const defaultProps = {
  value: [],
  onDeviceCreate: null,
};

class DevicesBrowser extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddModal: false,
    };
  }

  onScriptSelect(it) {
    const name = it.label;
    const { onScriptSelect } = this.props;
    if (isFunction(onScriptSelect)) {
      onScriptSelect(name);
    }
  }

  onAddClick() {
    this.setState({
      showAddModal: true,
    });
  }

  onAddCancel() {
    this.setState({
      showAddModal: false,
    });
  }

  onAddSuccess(deviceData) {
    const { onDeviceCreate } = this.props;
    if (isFunction(onDeviceCreate)) {
      onDeviceCreate(deviceData);
    }
    this.setState({
      showAddModal: false,
    });
  }

  render() {
    const { value } = this.props;
    const { showAddModal } = this.state;
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
          value={value}
          onClickItem={this.onScriptSelect}
        />
        <AddDevice
          show={showAddModal}
          onCancel={this.onAddCancel}
          onSuccess={this.onAddSuccess}
        />
      </Panel>
    );
  }
};

DevicesBrowser.propTypes = propTypes;
DevicesBrowser.defaultProps = defaultProps;

export default DevicesBrowser;
