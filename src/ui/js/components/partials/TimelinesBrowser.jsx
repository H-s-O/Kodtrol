import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import stopEvent from '../../lib/stopEvent';
import { deleteTimeline, selectTimeline } from '../../../../common/js/store/actions/timelines';
import { updateTimelineModal } from '../../../../common/js/store/actions/modals';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../styles/components/partials/timelinesbrowser.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  timelines: [],
};

class TimelinesBrowser extends PureComponent {
  onTimelineSelect = (it) => {
    const { doSelectTimeline } = this.props;
    const { id } = it;
    doSelectTimeline(id);
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
  
  onDeleteClick = (id) => {
    deleteWarning(`Are you sure you want to delete this timeline ?`, (result) => {
      if (result) {
        const { doDeleteTimeline } = this.props;
        doDeleteTimeline(id);
      }
    });
  }

  renderTreeActions = (it) => {
    return (
      <div
        className="pull-right"
      >
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
      </div>
    );
  }

  render = () => {
    const { timelines } = this.props;

    return (
      <Panel
        title="Timelines"
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
          value={timelines.map(({id, name}) => ({
            id,
            label: name,
            icon: 'file',
          }))}
          onClickItem={this.onTimelineSelect}
          renderActions={this.renderTreeActions}
        />
      </Panel>
    );
  }
};

TimelinesBrowser.propTypes = propTypes;
TimelinesBrowser.defaultProps = defaultProps;

const mapStateToProps = ({devices}) => {
  return {
    devices,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doSelectTimeline: (id) => dispatch(selectTimeline(id)),
    doDeleteTimeline: (id) => dispatch(deleteTimeline(id)),
    doCreateTimelineModal: () => dispatch(updateTimelineModal('add', {})),
    doEditTimelineModal: (data) => dispatch(updateTimelineModal('edit', data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinesBrowser);
