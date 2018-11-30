import React, { PureComponent } from 'react';

import BoardItem from './BoardItem';

class BoardBlock extends PureComponent {
  render = () => {
    return (
      <BoardItem
        {...this.props}
        typeLabel='block'
      />
    );
  }
}

export default BoardBlock;
