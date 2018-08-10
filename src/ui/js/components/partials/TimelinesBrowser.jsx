import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';

import Panel from './Panel';
import TreeView from './TreeView';
import TimelineModal from '../modals/TimelineModal';
import stopEvent from '../../lib/stopEvent';
import { createTimeline, updateTimeline, editTimeline } from '../../../../common/js/store/actions/timelines';

import styles from '../../../styles/components/partials/timelinesbrowser.scss';

const propTypes = {
  timelines: PropTypes.arrayOf(PropTypes.shape({})),
  onTimelineSelect: PropTypes.func,
  onTimelineCreate: PropTypes.func,
};

const defaultProps = {
  timelines: [],
  onTimelineSelect: null,
  onTimelineCreate: null,
};

class TimelinesBrowser extends PureComponent {
  state = {
    modalAction: null,
    modalValue: null,
  };
  
  onTimelineSelect = (it) => {
    const { dispatch } = this.props;
    const { id } = it;
    dispatch(editTimeline(id));
  }

  onAddClick = () => {
    this.setState({
      modalAction: 'add',
      modalValue: {
        id: uniqid() // generate new timeline id
      },
    });
  }
  
  onEditTimelineClick = () => {
    this.setState({
      modalAction: 'edit',
      modalValue: {} // temp,
    });
  }

  onModalCancel = () => {
    this.setState({
      modalAction: null,
    });
  }

  onModalSuccess = (timelineData) => {
    const { dispatch } = this.props;
    const { modalAction } = this.state;
    
    if (modalAction === 'add') {
      dispatch(createTimeline(timelineData));
    } else if (modalAction === 'edit') {
      dispatch(updateTimeline(timelineData));
    }
    
    this.setState({
      modalAction: null,
    });
  }
  
  renderModal = () => {
    const { modalAction, modalValue } = this.state;
    return (
      <TimelineModal
        initialValue={modalValue}
        show={modalAction !== null}
        title={modalAction === 'add' ? 'Add timeline' : 'Edit timeline'}
        onCancel={this.onModalCancel}
        onSuccess={this.onModalSuccess}
      />
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
          value={timelines}
          onClickItem={this.onTimelineSelect}
          actions={(
            <div
              className="pull-right"
            >
              <Button
                bsSize="xsmall"
                onClick={(e) => {stopEvent(e); this.onEditTimelineClick()}}
              >
                <Glyphicon
                  glyph="cog"
                />
              </Button>
            </div>
          )}
        />
        { timelines && this.renderModal() }
      </Panel>
    );
  }
};

TimelinesBrowser.propTypes = propTypes;
TimelinesBrowser.defaultProps = defaultProps;

export default connect()(TimelinesBrowser);
