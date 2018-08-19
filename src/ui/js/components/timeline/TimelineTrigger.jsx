import React, { PureComponent } from 'react';
import classNames from 'classnames'
import { remote } from 'electron';
import Color from 'color';
import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/partials/timeline.scss';

class TimelineTrigger extends PureComponent {
  onStartAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('inTime');
  }
  
  doDragAnchorDown = (mode) => {
    const { onAdjustItem, index } = this.props;
    onAdjustItem(index, mode);
  }
  
  render = () => {
    const { data, layerDuration } = this.props;
    const { inTime, color, trigger } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <TimelineItem
        {...this.props}
        typeLabel='trigger'
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

export default TimelineTrigger;
