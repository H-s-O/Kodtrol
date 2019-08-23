import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, ButtonGroup, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import mediaType from '../../../../common/js/lib/mediaType';
import { deleteMedia } from '../../../../common/js/store/actions/medias';
import { updateMediaModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/mediasbrowser.scss';

const propTypes = {
  medias: PropTypes.arrayOf(PropTypes.shape({})),
  doDeleteMedia: PropTypes.func.isRequired,
  doCreateMediaModal: PropTypes.func.isRequired,
  doDuplicateMediaModal: PropTypes.func.isRequired,
  doEditMediaModal: PropTypes.func.isRequired,
};

const defaultProps = {
  medias: [],
};

class MediasBrowser extends PureComponent {
  onAddClick = () => {
    const { doCreateMediaModal } = this.props;
    doCreateMediaModal();
  }
  
  onEditClick = (id) => {
    const { doEditMediaModal, medias } = this.props;
    const data = medias.find(it => it.id === id);
    doEditMediaModal(data);
  }
  
  onDuplicateClick = (id) => {
    const { doDuplicateMediaModal, medias } = this.props;
    const data = medias.find(it => it.id === id);
    doDuplicateMediaModal(data);
  }
  
  onDeleteClick = (id) => {
    deleteWarning(`Are you sure you want to delete this media ?`, (result) => {
      if (result) {
        const { doDeleteMedia } = this.props;
        doDeleteMedia(id);
      }
    });
  }

  mediaFileTypeToIcon = (file) => {
    switch (mediaType(file)) {
        case 'audio':
            return 'music';
            break;
        case 'video':
            return 'facetime-video';
            break;
    
        default:
            return 'question-sign';
            break;
    }
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
    const { medias } = this.props;
    return (
      <Panel
        title="Medias"
        className={styles.fullHeight}
        data-screenshot-id="medias-browser"
        headingContent={
          <div
            className="pull-right"
            data-screenshot-id="medias-browser-add"
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
          value={medias.map(({id, name, output, file}) => ({
            id,
            label: name,
            icon: this.mediaFileTypeToIcon(file),
            file,
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

MediasBrowser.propTypes = propTypes;
MediasBrowser.defaultProps = defaultProps;

const mapStateToProps = ({medias}) => {
  return {
    medias,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doDeleteMedia: (id) => dispatch(deleteMedia(id)),
    doCreateMediaModal: () => dispatch(updateMediaModal('add', {})),
    doEditMediaModal: (data) => dispatch(updateMediaModal('edit', data)),
    doDuplicateMediaModal: (data) => dispatch(updateMediaModal('duplicate', data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MediasBrowser);
