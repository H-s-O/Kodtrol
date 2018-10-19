import React, { PureComponent } from 'react';

import TimelineItem from './TimelineItem';
import timelineConnect from './timelineConnect';

class TimelineBlock extends PureComponent {
  render = () => {
    return (
      <TimelineItem
        {...this.props}
        typeLabel='block'
      />
    );
  }
}

export default timelineConnect(TimelineBlock);
