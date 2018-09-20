import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, ButtonGroup, ButtonToolbar, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { get } from 'lodash';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteTimeline, selectTimeline, runTimeline, stopTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/timelinesbrowser.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
  runTimeline: PropTypes.string,
  doSelectTimeline: PropTypes.func.isRequired,
  doDeleteTimeline: PropTypes.func.isRequired,
  doCreateTimelineModal: PropTypes.func.isRequired,
  doEditTimelineModal: PropTypes.func.isRequired,
  doDuplicateTimelineModal: PropTypes.func.isRequired,
  doRunTimeline: PropTypes.func.isRequired,
  doStopRunTimeline: PropTypes.func.isRequired,
};

const defaultProps = {
  timelines: [],
  runTimeline: null,
};

class TimelinesBrowser extends PureComponent {
  onTimelineSelect = (it) => {
    const { id } = it;
    const { doSelectTimeline, timelines } = this.props;
    const data = timelines.find(it => it.id === id);
    doSelectTimeline(data);
  }

  onAddClick = () => {
    const { doCreateTimelineModal } = this.props;
    doCreateTimelineModal();
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
    const { runTimeline } = this.props;
    
    if (it.id !== runTimeline) {
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
    const { timelines, currentTimeline, runTimeline } = this.props;

    return (
      <Panel
        title="Timelines"
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
          value={timelines.map(({id, name}) => ({
            id,
            label: name,
            icon: 'film',
            active: id === get(currentTimeline, 'id'),
          }))}
          onClickItem={this.onTimelineSelect}
          renderActions={this.renderTreeActions}
          renderTags={this.renderTreeTags}
        />
      </Panel>
    );
  }
};

TimelinesBrowser.propTypes = propTypes;
TimelinesBrowser.defaultProps = defaultProps;

const mapStateToProps = ({timelines, currentTimeline, runTimeline}) => {
  return {
    timelines,
    currentTimeline,
    runTimeline,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinesBrowser);
