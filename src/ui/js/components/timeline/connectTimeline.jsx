import React from 'react';

import timelineEditorContext from './timelineEditorContext';

export default (TimelineConnectedComponent) => {
  const { Consumer } = timelineEditorContext;
  return (
    <Consumer
    >
      {value => {
        
      }}
      <TimelineConnectedComponent
        
      />
    </Consumer>
  );
};