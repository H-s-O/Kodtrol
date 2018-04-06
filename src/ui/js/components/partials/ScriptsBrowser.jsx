import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { isFunction } from 'lodash';
import Panel from './Panel';
import TreeView from './TreeView';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onScriptSelect: PropTypes.func,
  onScriptCreate: PropTypes.func,
};

const defaultProps = {
  value: [],
  onScriptSelect: null,
  onScriptCreate: null,
};

class ScriptsBrowser extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddModal: false,
      newScriptName: null,
    };
  }

  onScriptSelect(name) {
    const { onScriptSelect } = this.props;
    if (onScriptSelect) {
      onScriptSelect(name);
    }
  }

  onAddClick() {
    this.setState({
      showAddModal: true,
    });
  }

  onAddScriptNameChange(e) {
    this.setState({
      newScriptName: e.target.value,
    });
  }

  onAddCancelClick() {
    this.setState({
      showAddModal: false,
    });
  }

  onAddSaveClick() {
    const { onScriptCreate } = this.props;
    if (isFunction(onScriptCreate)) {
      const { newScriptName } = this.state;
      onScriptCreate(newScriptName);
    }
    this.setState({
      showAddModal: false,
    });
  }

  render() {
    const { value, onScriptSelect } = this.props;
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
          value={value}
          onClickItem={(it) => this.onScriptSelect(it.label)}
        />
        <Modal
          show={showAddModal}
          bsSize="small"
          keyboard
        >
          <Modal.Body>
            <FormControl
              type="text"
              placeholder="Enter new script name"
              onChange={this.onAddScriptNameChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.onAddCancelClick}
            >
              Cancel
            </Button>
            <Button
              bsStyle="success"
              onClick={this.onAddSaveClick}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

export default ScriptsBrowser;
