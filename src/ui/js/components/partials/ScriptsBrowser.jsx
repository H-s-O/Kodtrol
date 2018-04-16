import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { isFunction } from 'lodash';
import Panel from './Panel';
import TreeView from './TreeView';
import AddScript from '../modals/AddScript';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onScriptSelect: PropTypes.func,
  onScriptCreate: PropTypes.func,
};

const defaultProps = {
  value: [],
  devices: [],
  onScriptSelect: null,
  onScriptCreate: null,
};

class ScriptsBrowser extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddModal: false,
    };
  }

  onScriptSelect(it) {
    const { onScriptSelect } = this.props;
    if (isFunction(onScriptSelect)) {
      const { id } = it;
      onScriptSelect(id);
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

  onAddSuccess(scriptData) {
    const { onScriptCreate } = this.props;
    if (isFunction(onScriptCreate)) {
      onScriptCreate(scriptData);
    }
    this.setState({
      showAddModal: false,
    });
  }

  render() {
    const { value, devices } = this.props;
    const { showAddModal } = this.state;
    return (
      <Panel
        title="Scripts"
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
        <AddScript
          show={showAddModal}
          onCancel={this.onAddCancel}
          onSuccess={this.onAddSuccess}
          devices={devices}
        />
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

export default ScriptsBrowser;
