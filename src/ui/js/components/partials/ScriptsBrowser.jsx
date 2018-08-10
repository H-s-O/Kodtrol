import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';

import Panel from './Panel';
import TreeView from './TreeView';
import ScriptModal from '../modals/ScriptModal';
import stopEvent from '../../lib/stopEvent';
import { createScript, updateScript, editScript } from '../../../../common/js/store/actions/scripts';

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

class ScriptsBrowser extends PureComponent {
  state = {
    modalAction: null,
    modalValue: null,
  };

  onScriptSelect = (it) => {
    const { dispatch } = this.props;
    const { id } = it;
    dispatch(editScript(id));
  }

  onAddClick = () => {
    this.setState({
      modalAction: 'add',
      modalValue: {
        id: uniqid(), // generate new script id
      },
    });
  }
  
  onEditScriptClick = () => {
    this.setState({
      modalAction: 'edit',
      modalValue: this.props.value[3], // temp
    });
  }

  onModalCancel = () => {
    this.setState({
      modalAction: null,
    });
  }

  onModalSuccess = (scriptData) => {
    const { dispatch } = this.props;
    const { modalAction } = this.state;
    
    if (modalAction === 'add') {
      dispatch(createScript(scriptData));
    } else if (modalAction === 'edit') {
      dispatch(updateScript(scriptData));
    }
    
    this.setState({
      modalAction: null,
    });
  }
  
  renderModal = () => {
    const { devices } = this.props;
    const { modalAction, modalValue } = this.state;
    return (
      <ScriptModal
        initialValue={modalValue}
        show={modalAction !== null}
        title={modalAction === 'add' ? 'Add script' : 'Edit script'}
        onCancel={this.onModalCancel}
        onSuccess={this.onModalSuccess}
        devices={devices}
      />
    );
  }

  render = () => {
    const { value, devices } = this.props;
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
              <Button
                bsSize="xsmall"
                onClick={(e) => {stopEvent(e); this.onEditScriptClick()}}
              >
                <Glyphicon
                  glyph="cog"
                />
              </Button>
            </div>
          )}
        />
        { devices && this.renderModal() }
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

export default connect()(ScriptsBrowser);
