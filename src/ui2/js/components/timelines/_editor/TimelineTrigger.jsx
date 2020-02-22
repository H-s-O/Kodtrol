import React, { PureComponent } from 'react';

import TimelineItem from './TimelineItem';

class TimelineTrigger extends PureComponent {
  getItemLabel = () => {
    const { data } = this.props;
    const { trigger } = data;
    return trigger;
  }
  
  getDialogLabel = () => {
    const { data } = this.props;
    const { trigger } = data;
    return trigger;
  }
  
  render = () => {
    return (
      <TimelineItem
        {...this.props}
        type='simple'
        typeLabel='trigger'
        getItemLabel={this.getItemLabel}
        getDialogLabel={this.getDialogLabel}
        canCopyEndTime={false}
        canPasteEndTime={false}
      />
    );
  }
}

export default TimelineTrigger;
