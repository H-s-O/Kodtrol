import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import Panel from './Panel';
import TreeView from './TreeView';
import TimelineModal from '../modals/TimelineModal';

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
    const { onTimelineSelect } = this.props;
    const { id } = it;
    onTimelineSelect(id);
  }

  onAddClick = () => {
    this.setState({
      modalAction: 'add',
      modalValue: {
        id: uniqid() // generate new timeline id
      },
    });
  }
  
  onEditClick = () => {
    
  }

  onModalCancel = () => {
    this.setState({
      modalAction: null,
    });
  }

  onModalSuccess = (timelineData) => {
    const { onTimelineCreate } = this.props;
    onTimelineCreate(timelineData);
    
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
              <DropdownButton
                noCaret
                title={(
                  <Glyphicon
                    glyph="cog"
                  />
                )}
                key="asdas"
                bsSize="xsmall"
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem eventKey="1">Edit</MenuItem>
                <MenuItem eventKey="2">Duplicate</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="3" bsStyle="danger">Delete</MenuItem>
              </DropdownButton>
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

export default TimelinesBrowser;
