import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, ButtonGroup, ButtonToolbar, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { get } from 'lodash';

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
};

class TimelinesBrowser extends PureComponent {
  onItemSelect = (it) => {
    const { id, type } = it;
    
    if (type === 'timeline') {
      const { doSelectTimeline, timelines } = this.props;
      const data = timelines.find(it => it.id === id);
      doSelectTimeline(data);
    } else if (type === 'board') {
      const { doSelectBoard, boards } = this.props;
      const data = boards.find(it => it.id === id);
      doSelectBoard(data);
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
  
  onEditClick = (id) => {
    const { doEditTimelineModal, timelines } = this.props;
    const data = timelines.find(it => it.id === id);
    doEditTimelineModal(data);
  }
  
  onDuplicateClick = (id) => {
    const { doDuplicateTimelineModal, timelines } = this.props;
    const data = timelines.find(it => it.id === id);
    doDuplicateTimelineModal(data);
  }
  
  onPreviewClick = (id) => {
    const { doRunTimeline } = this.props;
    doRunTimeline(id);
  }
  
  onStopPreviewClick = () => {
    const { doStopRunTimeline } = this.props;
    doStopRunTimeline();
  }
  
  onDeleteClick = (id) => {
    deleteWarning(`Are you sure you want to delete this timeline ?`, (result) => {
      if (result) {
        const { doDeleteTimeline } = this.props;
        doDeleteTimeline(id);
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
    return (
      <Fragment
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
          <ButtonToolbar
            className="pull-right"
          >
            <Button
              bsSize="xsmall"
              disabled={runTimeline === null}
              bsStyle={runTimeline !== null ? 'danger' : 'default' }
              onClick={runTimeline !== null ? this.onStopPreviewClick : null}
            >
              <Glyphicon
                glyph="eye-close"
              />
            </Button>
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
          </ButtonToolbar>
        }
      >
        <TreeView
          className={styles.wrapper}
          value={timelines.map(({id, name}) => ({
            type: 'timeline',
            id,
            label: name,
            icon: 'film',
            active: id === get(currentTimeline, 'id'),
          })).concat(boards.map(({id, name}) => ({
            type: 'board',
            id,
            label: name,
            icon: 'th',
            active: id === get(currentBoard, 'id'),
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
    doCreateBoardModal: () => dispatch(updateBoardModal('add', {})),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinesBrowser);
