import React, { useState, useCallback } from 'react';
import { Tree } from '@blueprintjs/core';

export default function ManagedTree(props) {
  const { contents, ...otherProps } = props;
  const [stateContents, setStateContents] = useState(contents);

  const nodeExpandHandler = useCallback((node) => {
    node.isExpanded = true;
    // setStateContents(stateContents)
    console.log(node);
  }, [stateContents]);

  return (
    <Tree
      {...otherProps}
      contents={stateContents}
      onNodeExpand={nodeExpandHandler}
    />
  );
}
