import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import BoardItem from './BoardItem';

class BoardBlock extends PureComponent {
  generateLabel = () => {
    const { data, relatedScript } = this.props;
    const { type, name } = data;
    const scriptName = relatedScript ? relatedScript.name : null;
    const finalName = name || scriptName;

    let typeLabel = null;
    switch (type) {
      case 'trigger_once':
        typeLabel = 'trigger once';
        break;
      case 'trigger_mult':
        typeLabel = 'trigger multiple';
        break;
      case 'toggle':
        typeLabel = 'toggle';
        break;
    }
    
    const label = `${finalName} [${typeLabel}]`;
    
    return label;
  }
  
  render = () => {
    const { relatedScript, data, ...otherProps } = this.props;
    const blockName = data.name;
    const scriptName = relatedScript ? relatedScript.name : null;
    const finalName = blockName || scriptName;

    return (
      <BoardItem
        {...otherProps}
        data={{
          ...data,
          name: finalName,
        }}
        typeLabel='block'
        getItemLabel={this.generateLabel}
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
      return null;
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
    relatedScript: relatedScriptSelector(state, props),
  };
};

export default connect(mapStateToProps)(BoardBlock);
