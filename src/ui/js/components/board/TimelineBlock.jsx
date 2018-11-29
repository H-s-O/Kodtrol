import React, { PureComponent } from 'react';

import TimelineItem from './TimelineItem';

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

export default TimelineBlock;
