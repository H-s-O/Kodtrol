import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
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

class DevicesBrowser extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddModal: false,
    };
  }

  // onScriptSelect(it) {
  //   const name = it.label;
  //   const { onScriptSelect } = this.props;
  //   if (isFunction(onScriptSelect)) {
  //     onScriptSelect(name);
  //   }
  // }

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

  onActionsClick(e) {
    e.stopPropagation();
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
          style={{
            overflowY: 'auto',
            height: '94%',
          }}
          value={value}
          onClickItem={this.onScriptSelect}
          actions={(
            <div
              className="pull-right"
            >
              <DropdownButton
                noCaret
                title={(
                  <Glyphicon
                    glyph="cog"
                  />
                )}
                key="asdas"
                bsSize="xsmall"
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem eventKey="1">Edit</MenuItem>
                <MenuItem eventKey="2">Duplicate</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="3" bsStyle="danger">Delete</MenuItem>
              </DropdownButton>
            </div>
          )}
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
