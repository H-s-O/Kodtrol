import React, { PureComponent } from 'react';

import BoardItem from './BoardItem';

class BoardBlock extends PureComponent {
  generateLabel = () => {
    const { data } = this.props;
    const { type, name } = data;
    
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
    
    const label = `${name} [${typeLabel}]`;
    
    return label;
  }
  
  render = () => {
    return (
      <BoardItem
        {...this.props}
        typeLabel='block'
        getItemLabel={this.generateLabel}
      />
    );
  }
}

export default BoardBlock;
