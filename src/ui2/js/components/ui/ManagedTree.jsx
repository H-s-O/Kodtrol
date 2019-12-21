import React, { Component } from 'react';
import { Tree } from '@blueprintjs/core';

export default class ManagedTree extends Component {
  render = () => {
    const { contents } = this.props;

    return (
      <Tree
        contents={contents}
      />
    );
  }
}
