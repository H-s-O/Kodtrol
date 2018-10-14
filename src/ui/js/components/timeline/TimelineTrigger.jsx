import React, { PureComponent } from 'react';
import classNames from 'classnames'
import Color from 'color';

import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelinetrigger.scss';

class TimelineTrigger extends PureComponent {
  onStartAnchorDown = (e) => {
    console.log('trigger anchor start down', e.type);
    e.preventDefault();
    this.doDragAnchorDown('inTime');
  }
  
  doDragAnchorDown = (mode) => {
    const { timelineAdjustItem, data } = this.props;
    const { id } = data;
    timelineAdjustItem(id, mode);
  }
  
  render = () => {
    const { data, layerDuration } = this.props;
    const { inTime, color, trigger } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <TimelineItem
        {...this.props}
        typeLabel='trigger'
        canCopyEndTime={false}
        canPasteEndTime={false}
      >
        <div
          className={classNames({
            [styles.timelineTrigger]: true,
            [styles.lightTrigger]: lightColor,
          })}
          style={{
            left: percentString(inTime / layerDuration),
            backgroundColor: color,
          }}
          onMouseDown={this.onStartAnchorDown}
        >
          <span
            style={{
              backgroundColor: color,
            }}
            className={styles.timelineTriggerLabel}
          >
            { trigger }
          </span>
        </div>
      </TimelineItem>
    );
  }
}

export default timelineConnect(TimelineTrigger);
