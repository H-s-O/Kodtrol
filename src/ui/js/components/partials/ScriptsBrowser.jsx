import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Label, ButtonToolbar, ButtonGroup, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteScript, selectScript, previewScript, stopPreviewScript } from '../../../../common/js/store/actions/scripts';
import { updateScriptModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

const propTypes = {
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  previewScript: PropTypes.string,
  doDeleteScript: PropTypes.func.isRequired,
  doCreateScriptModal: PropTypes.func.isRequired,
  doEditScriptModal: PropTypes.func.isRequired,
  doDuplicateScriptModal: PropTypes.func.isRequired,
  doSelectScript: PropTypes.func.isRequired,
  doPreviewScript: PropTypes.func.isRequired,
  doStopPreviewScript: PropTypes.func.isRequired,
};

const defaultProps = {
  scripts: [],
  previewScript: null,
};

class ScriptsBrowser extends PureComponent {
  onScriptSelect = (it) => {
    const { id } = it;
    const { doSelectScript, scripts } = this.props;
    const data = scripts.find(it => it.id === id);
    doSelectScript(data);
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
  
  onPreviewClick = (id) => {
    const { doPreviewScript } = this.props;
    doPreviewScript(id);
  }
  
  onStopPreviewClick = () => {
    const { doStopPreviewScript } = this.props;
    doStopPreviewScript();
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
            onClick={(e) => {stopEvent(e); this.onPreviewClick(it.id)}}
          >
            <Glyphicon
              glyph="eye-open"
            />
          </Button>
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
  
  renderTreeTags = (it) => {
    const { previewScript } = this.props;
    
    if (it.id !== previewScript) {
      return null;
    }
    
    return (
      <Label
        bsSize="xsmall"
        bsStyle="success"
      >
        <Glyphicon
          glyph="eye-open"
        />
      </Label>
    )
  }
  
  render = () => {
    const { scripts, currentScript, previewScript } = this.props;
    return (
      <Panel
        title="Scripts"
        className={styles.fullHeight}
        headingContent={
          <ButtonToolbar
            className="pull-right"
          >
            <Button
              bsSize="xsmall"
              disabled={previewScript === null}
              bsStyle={previewScript !== null ? 'danger' : 'default' }
              onClick={previewScript !== null ? this.onStopPreviewClick : null}
            >
              <Glyphicon
                glyph="eye-close"
              />
            </Button>
            <Button
              bsSize="xsmall"
              onClick={this.onAddClick}
            >
              <Glyphicon
                glyph="plus"
              />
            </Button>
          </ButtonToolbar>
        }
      >
        <TreeView
          className={styles.wrapper}
          value={scripts.map(({id, name}) => ({
            id,
            label: name,
            icon: 'file',
            active: id === get(currentScript, 'id'),
          }))}
          onClickItem={this.onScriptSelect}
          renderActions={this.renderTreeActions}
          renderTags={this.renderTreeTags}
        />
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

const mapStateToProps = ({scripts, currentScript, previewScript}) => {
  return {
    scripts,
    currentScript,
    previewScript,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doDeleteScript: (id) => dispatch(deleteScript(id)),
    doCreateScriptModal: () => dispatch(updateScriptModal('add', {})),
    doEditScriptModal: (data) => dispatch(updateScriptModal('edit', data)),
    doDuplicateScriptModal: (data) => dispatch(updateScriptModal('duplicate', data)),
    doSelectScript: (data) => dispatch(selectScript(data)),
    doPreviewScript: (id) => dispatch(previewScript(id)),
    doStopPreviewScript: () => dispatch(stopPreviewScript()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsBrowser);
