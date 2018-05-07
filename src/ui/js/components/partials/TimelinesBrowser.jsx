import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import { isFunction } from 'lodash';
import Panel from './Panel';
import TreeView from './TreeView';
import AddTimeline from '../modals/AddTimeline';

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
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showAddModal: false,
    };
  }

  onTimelineSelect(it) {
    const { onTimelineSelect } = this.props;
    if (isFunction(onTimelineSelect)) {
      const { id } = it;
      onTimelineSelect(id);
    }
  }

  onAddClick() {
    this.setState({
      showAddModal: true,
    });
  }

  onAddCancel() {
    this.setState({
      showAddModal: false,
    });
  }

  onAddSuccess(timelineData) {
    const { onTimelineCreate } = this.props;
    if (isFunction(onTimelineCreate)) {
      onTimelineCreate(timelineData);
    }
    this.setState({
      showAddModal: false,
    });
  }

  render() {
    const { timelines } = this.props;
    const { showAddModal } = this.state;
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
        <AddTimeline
          show={showAddModal}
          onCancel={this.onAddCancel}
          onSuccess={this.onAddSuccess}
        />
      </Panel>
    );
  }
};

TimelinesBrowser.propTypes = propTypes;
TimelinesBrowser.defaultProps = defaultProps;

export default TimelinesBrowser;
