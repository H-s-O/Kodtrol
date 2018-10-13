import React, { PureComponent } from 'react';

import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import TimelineDisplay from './TimelineDisplay';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelinewrapper.scss';

class TimelineWrapper extends PureComponent {
  timelineContainer = null;
  timelineCursorTracker = null;
  
  constructor(props) {
    super(props);
    
    // Homemade ref callback that bypasses the timelineConnect() wrapper
    const { wrapperRef } = props;
    wrapperRef(this);
  }
  
  getTimelineScreenXFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft } = this.timelineContainer;
    
    const pos = (clientX - left + scrollLeft);
    return pos;
  }
  
  getTimelinePercentFromEvent = (e) => {
    const { timelineData } = this.props;
    const { zoom } = timelineData;
    
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft, scrollWidth } = this.timelineContainer;
    
    const percent = (clientX - left + scrollLeft) / scrollWidth;
    return percent;
  }
  
  onContainerClick = (e) => {
    const { timelineUpdatePosition } = this.props;
    timelineUpdatePosition(e);
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
      this.forceUpdate(); // needed for live refresh of timeline, temp
    }
  }
  
  setTimelineCursorTrackerRef = (ref) => {
    this.timelineCursorTracker = ref;
  }
  
  renderTimelineCursorTracker = () => {
    return (
      <div
        ref={this.setTimelineCursorTrackerRef}
        className={styles.timelineCursorTracker}
      >
      </div>
    )
  }
  
  renderTimelineTracker = () => {
    const { timelineInfo, timelineData } = this.props;
    const { position } = timelineInfo;
    const { duration, zoom } = timelineData;
    
    const left = percentString((position / duration) * zoom);
    
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
  
  setTimelineContainerRef = (ref) => {
    this.timelineContainer = ref;
  }
  
  render = () => {
    const { timelineData } = this.props;
    
    return (
      <div
        ref={this.setTimelineContainerRef}
        className={styles.wrapper}
        onClick={this.onContainerClick}
        onMouseMove={this.onContainerMouseMove}
      >
        <TimelineDisplay
          {...timelineData}
        />
        { this.renderTimelineCursorTracker() }
        { this.renderTimelineTracker() }
      </div>
    );
  }
}

export default timelineConnect(TimelineWrapper);