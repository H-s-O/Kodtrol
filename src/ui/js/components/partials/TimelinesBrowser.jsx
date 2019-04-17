import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, ButtonGroup, ButtonToolbar, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteTimeline, selectTimeline, runTimeline, stopTimeline } from '../../../../common/js/store/actions/timelines';
import { deleteBoard, selectBoard, runBoard, stopBoard } from '../../../../common/js/store/actions/boards';
import { updateTimelineModal, updateBoardModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/timelinesbrowser.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
  boards: PropTypes.arrayOf(PropTypes.shape({})),
  currentTimeline: PropTypes.string,
  currentBoard: PropTypes.string,
  runTimeline: PropTypes.string,
  runBoard: PropTypes.string,
  doSelectTimeline: PropTypes.func.isRequired,
  doDeleteTimeline: PropTypes.func.isRequired,
  doCreateTimelineModal: PropTypes.func.isRequired,
  doEditTimelineModal: PropTypes.func.isRequired,
  doDuplicateTimelineModal: PropTypes.func.isRequired,
  doRunTimeline: PropTypes.func.isRequired,
  doStopRunTimeline: PropTypes.func.isRequired,
  doSelectBoard: PropTypes.func.isRequired,
  doCreateBoardModal: PropTypes.func.isRequired,
};

const defaultProps = {
  timelines: [],
  boards: [],
  runTimeline: null,
  runBoard: null,
  currentTimeline: null,
  currentBoard: null,
};

class TimelinesBrowser extends PureComponent {
  onItemSelect = (it) => {
    const { id, type } = it;
    
    if (type === 'timeline') {
      const { doSelectTimeline, timelines } = this.props;
      doSelectTimeline(id);
    } else if (type === 'board') {
      const { doSelectBoard, boards } = this.props;
      doSelectBoard(id);
    }
  }

  onAddTimelineClick = () => {
    const { doCreateTimelineModal } = this.props;
    doCreateTimelineModal();
  }
  
  onAddBoardClick = () => {
    const { doCreateBoardModal } = this.props;
    doCreateBoardModal();
  }
  
  onEditClick = (it) => {
    const { id, type } = it;
    if (type === 'timeline') { 
      this.editTimeline(id);
    } else if (type === 'board') {
      this.editBoard(id);
    }
  }
  
  editTimeline = (id) => {
    const { doEditTimelineModal, timelines } = this.props;
    const data = timelines.find(it => it.id === id);
    doEditTimelineModal(data);
  }
  
  editBoard = (id) => {
    const { doEditBoardModal, boards } = this.props;
    const data = boards.find(it => it.id === id);
    doEditBoardModal(data);
  }
  
  onDuplicateClick = (it) => {
    const { id, type } = it;
    if (type === 'timeline') { 
      this.duplicateTimeline(id);
    } else if (type === 'board') {
      this.duplicateBoard(id);
    }
  }
  
  duplicateTimeline = (id) => {
    const { doDuplicateTimelineModal, timelines } = this.props;
    const data = timelines.find(it => it.id === id);
    doDuplicateTimelineModal(data);
  }
  
  duplicateBoard = (id) => {
    const { doDuplicateBoardModal, boards } = this.props;
    const data = boards.find(it => it.id === id);
    doDuplicateBoardModal(data);
  }
  
  onPreviewClick = (it) => {
    const { id, type } = it;
    if (type === 'timeline') {
      this.runTimeline(id);
    } else if (type === 'board') {
      this.runBoard(id);
    }
  }
  
  runTimeline = (id) => {
    const { doRunTimeline } = this.props;
    doRunTimeline(id);
  }
  
  runBoard = (id) => {
    const { doRunBoard } = this.props;
    doRunBoard(id);
  }
  
  onStopTimelineClick = () => {
    const { doStopRunTimeline } = this.props;
    doStopRunTimeline();
  }
  
  onStopBoardClick = () => {
    const { doStopRunBoard } = this.props;
    doStopRunBoard();
  }
  
  onDeleteClick = (it) => {
    const { id, type } = it;
    if (type === 'timeline') { 
      this.deleteTimeline(id);
    } else if (type === 'board') {
      this.deleteBoard(id);
    }
  }
  
  deleteTimeline = (id) => {
    deleteWarning(`Are you sure you want to delete this timeline ?`, (result) => {
      if (result) {
        const { doDeleteTimeline } = this.props;
        doDeleteTimeline(id);
      }
    });
  }
  
  deleteBoard = (id) => {
    deleteWarning(`Are you sure you want to delete this board ?`, (result) => {
      if (result) {
        const { doDeleteBoard } = this.props;
        doDeleteBoard(id);
      }
    });
  }
  
  renderTreeTags = (it) => {
    const { runTimeline, runBoard } = this.props;
    const { id, type} = it;
    
    if (type === 'timeline' && id !== runTimeline
        || type === 'board' && id !== runBoard) {
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
  
  renderTreeActions = (it) => {
    const { id } = it;
    const { runTimeline, runBoard } = this.props;
    
    return (
      <Fragment
      >
        { id === runTimeline ? (
          <Button
            className={styles.buttonMargin}
            bsSize="xsmall"
            bsStyle="danger"
            onClick={(e) => {stopEvent(e); this.onStopTimelineClick()}}
          >
            <Glyphicon
              glyph="off"
            />
          </Button>
        ) : id === runBoard ? (
          <Button
            className={styles.buttonMargin}
            bsSize="xsmall"
            bsStyle="danger"
            onClick={(e) => {stopEvent(e); this.onStopBoardClick()}}
          >
            <Glyphicon
              glyph="off"
            />
          </Button>
        ) : (
          <Button
            bsSize="xsmall"
            onClick={(e) => {stopEvent(e); this.onPreviewClick(it)}}
          >
            <Glyphicon
              glyph="eye-open"
            />
          </Button>
        )}
        <ButtonGroup
          className={styles.buttonMargin}
        >
          <Button
            bsSize="xsmall"
            onClick={(e) => {stopEvent(e); this.onDuplicateClick(it)}}
          >
            <Glyphicon
              glyph="duplicate"
            />
          </Button>
          <Button
            bsSize="xsmall"
            onClick={(e) => {stopEvent(e); this.onEditClick(it)}}
          >
            <Glyphicon
              glyph="cog"
            />
          </Button>
          <Button
            className={styles.buttonMargin}
            bsSize="xsmall"
            bsStyle="danger"
            onClick={(e) => {stopEvent(e); this.onDeleteClick(it)}}
          >
            <Glyphicon
              glyph="trash"
            />
          </Button>
        </ButtonGroup>
      </Fragment>
    );
  }

  render = () => {
    const { timelines, currentTimeline, runTimeline, boards, currentBoard, runBoard } = this.props;

    return (
      <Panel
        title="Timelines &amp; Boards"
        className={styles.fullHeight}
        headingContent={
          <ButtonGroup
            className="pull-right"
          >
            <DropdownButton
              id="add-timeline-board"
              title={(
                <Glyphicon
                  glyph="plus"
                  />
              )}
              bsSize="xsmall"
              onClick={stopEvent}
              pullRight
              >
              <MenuItem
                onSelect={this.onAddTimelineClick}
                >
                Add timeline...
              </MenuItem>
              <MenuItem
                onSelect={this.onAddBoardClick}
                >
                Add board...
              </MenuItem>
            </DropdownButton>
          </ButtonGroup>
        }
      >
        <TreeView
          className={styles.wrapper}
          value={timelines.map(({id, name}) => ({
            type: 'timeline',
            id,
            label: name,
            icon: 'film',
            active: id === currentTimeline,
          })).concat(boards.map(({id, name}) => ({
            type: 'board',
            id,
            label: name,
            icon: 'th',
            active: id === currentBoard,
          })))}
          onClickItem={this.onItemSelect}
          renderActions={this.renderTreeActions}
          renderTags={this.renderTreeTags}
        />
      </Panel>
    );
  }
};

TimelinesBrowser.propTypes = propTypes;
TimelinesBrowser.defaultProps = defaultProps;

const mapStateToProps = ({timelines, currentTimeline, runTimeline, boards, currentBoard, runBoard}) => {
  return {
    timelines,
    currentTimeline,
    runTimeline,
    boards,
    currentBoard,
    runBoard,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doSelectTimeline: (id) => dispatch(selectTimeline(id)),
    doDeleteTimeline: (id) => dispatch(deleteTimeline(id)),
    doCreateTimelineModal: () => dispatch(updateTimelineModal('add', {})),
    doEditTimelineModal: (data) => dispatch(updateTimelineModal('edit', data)),
    doDuplicateTimelineModal: (data) => dispatch(updateTimelineModal('duplicate', data)),
    doRunTimeline: (id) => dispatch(runTimeline(id)),
    doStopRunTimeline: () => dispatch(stopTimeline()),
    doSelectBoard: (id) => dispatch(selectBoard(id)),
    doDeleteBoard: (id) => dispatch(deleteBoard(id)),
    doCreateBoardModal: () => dispatch(updateBoardModal('add', {})),
    
    doEditBoardModal: (data) => dispatch(updateBoardModal('edit', data)),
    doDuplicateBoardModal: (data) => dispatch(updateBoardModal('duplicate', data)),
    doRunBoard: (id) => dispatch(runBoard(id)),
    doStopRunBoard: () => dispatch(stopBoard()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinesBrowser);
