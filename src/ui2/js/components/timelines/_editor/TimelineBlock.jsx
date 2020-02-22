import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import TimelineItem from './TimelineItem';

class TimelineBlock extends PureComponent {
  render = () => {
    const { relatedScript, data, ...otherProps } = this.props;
    const blockName = data.name;
    const scriptName = relatedScript ? relatedScript.name : null;
    const finalName = blockName || scriptName;
    
    return (
      <TimelineItem
        {...otherProps}
        data={{
          ...data,
          name: finalName,
        }}
        typeLabel='block'
      />
    );
  }
}

const relatedScriptSelector = createSelector(
  [
    (state, props) => state.scripts,
    (state, props) => props.data.script,
  ],
  (scripts, relatedScriptId) => {
    if (!relatedScriptId) {
      return null
    }
    const script = scripts.find(({id}) => id === relatedScriptId);
    if (!script) {
      return null;
    }
    return script;
  }
);

const mapStateToProps = (state, props) => {
  return {
    relatedScript: relatedScriptSelector(state, props)
  };
};

export default connect(mapStateToProps)(TimelineBlock);
