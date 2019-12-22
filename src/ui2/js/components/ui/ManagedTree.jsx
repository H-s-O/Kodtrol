import React, { Component } from 'react';
import { Tree } from '@blueprintjs/core';

export default class ManagedTree extends Component {
  render = () => {
    const { contents, ...otherProps } = this.props;

    return (
      <Tree
        {...otherProps}
        contents={contents}
      />
    );
  }
}
