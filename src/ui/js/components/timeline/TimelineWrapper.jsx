import React, { PureComponent } from 'react';
import { get } from 'lodash';

import stopEvent from '../../lib/stopEvent';
import TimelineDisplay from './TimelineDisplay';

import styles from '../../../styles/components/timeline/timelinewrapper.scss';

class TimelineWrapper extends PureComponent {
  timelineContainer = null;
  timelineCursorTracker = null;
  
  onContainerClick = (e) => {
    return;
    stopEvent(e);

    const { timelineInfo } = this.props;
    const newPosition = this.getTimelinePositionFromEvent(e);
    const newInfo = {
      ...timelineInfo,
      position: newPosition,
    };
    
    this.doUpdateInfo(newInfo);
  }
  
  onContainerMouseMove = (e) => {
    const { timelineData } = this.props;
    if (timelineData) {
      const cursorPos = this.getTimelineScreenXFromEvent(e);
      this.timelineCursorTracker.style = `left:${cursorPos}px`;
    }
    
    return;
    const { adjustItemPath, adjustItemMode } = this.state;
    if (adjustItemPath !== null) {
      const { timelineData } = this.props;
      const newValue = this.getTimelinePositionFromEvent(e);
      
      const newData = set(timelineData, `${adjustItemPath}.${adjustItemMode}`, newValue);

      this.setState({
        timelineDataTemp: newData,
      });
      this.forceUpdate(); // needed for live refresh of timeline
    }
  }
  
  renderTimelineCursorTracker = () => {
    return (
      <div
        ref={(ref) => this.timelineCursorTracker = ref}
        className={styles.timelineCursorTracker}
      >
      </div>
    )
  }
  
  renderTimelineTracker = () => {
    const { timelineInfo, timelineData } = this.props;
    const { position } = timelineInfo;
    const { duration } = timelineData;
    
    const left = percentString(position / duration);
    
    return (
      <div
        className={styles.timelineTracker}
        style={{
          left
        }}
      >
        <div
          className={styles.arrow}
        >
        </div>
      </div>
    );
  }
  
  getTimelineScreenXFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft } = this.timelineContainer;
    const pos = (clientX - left + scrollLeft);
    return pos;
  }
  
  render = () => {
    const { timelineData } = this.props;
    
    return (
      <div
        ref={(ref) => this.timelineContainer = ref}
        className={styles.wrapper}
        onClick={this.onContainerClick}
        onMouseMove={this.onContainerMouseMove}
      >
        <TimelineDisplay
          {...timelineData}
        />
        { this.renderTimelineCursorTracker() }
      </div>
    );
  }
}

export default TimelineWrapper;