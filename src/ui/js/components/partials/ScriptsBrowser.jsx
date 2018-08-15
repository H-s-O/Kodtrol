import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteScript } from '../../../../common/js/store/actions/scripts';
import { updateScriptModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

const propTypes = {
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doDeleteScript: PropTypes.func.isRequired,
  doCreateScriptModal: PropTypes.func.isRequired,
  doEditScriptModal: PropTypes.func.isRequired,
};

const defaultProps = {
  scripts: [],
};

class ScriptsBrowser extends PureComponent {
  onScriptSelect = (it) => {
    // @TODO
  }
  
  onAddClick = () => {
    const { doCreateScriptModal } = this.props;
    doCreateScriptModal();
  }
  
  onEditClick = (id) => {
    const { doEditScriptModal, scripts } = this.props;
    const data = scripts.find(it => it.id === id);
    doEditScriptModal(data);
  }
  
  onDuplicateClick = (id) => {
    const { doDuplicateScriptModal, scripts } = this.props;
    const data = scripts.find(it => it.id === id);
    doDuplicateScriptModal(data);
  }
  
  onDeleteClick = (id) => {
    deleteWarning(`Are you sure you want to delete this script ?`, (result) => {
      if (result) {
        const { doDeleteScript } = this.props;
        doDeleteScript(id);
      }
    });
  }
  
  renderTreeActions = (it) => {
    return (
      <div
        className="pull-right"
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
        </ButtonGroup>
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
    const { scripts } = this.props;
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
          value={scripts.map(({id, name}) => ({
            id,
            label: name,
            icon: 'file',
          }))}
          onClickItem={this.onScriptSelect}
          renderActions={this.renderTreeActions}
        />
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

const mapStateToProps = ({scripts}) => {
  return {
    scripts,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doDeleteScript: (id) => dispatch(deleteScript(id)),
    doCreateScriptModal: () => dispatch(updateScriptModal('add', {})),
    doEditScriptModal: (data) => dispatch(updateScriptModal('edit', data)),
    doDuplicateScriptModal: (data) => dispatch(updateScriptModal('duplicate', data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsBrowser);
