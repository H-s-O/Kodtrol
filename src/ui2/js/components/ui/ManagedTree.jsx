import React, { useState, useMemo, useCallback } from 'react';
import { Tree } from '@blueprintjs/core';

export default function ManagedTree({
  items = [],
  folders = [],
  ...otherProps
}) {
  const initialFoldersStates = useMemo(() => folders.reduce((obj, { id, isExpanded = false }) => ({
    ...obj,
    [id]: isExpanded,
  }), {}), [folders]);

  const [foldersStates, setFoldersStates] = useState(initialFoldersStates);
  const nodeExpandHandler = useCallback(({ id }) => {
    setFoldersStates({
      ...foldersStates,
      [id]: true,
    });
  }, [foldersStates]);
  const nodeCollapseHandler = useCallback(({ id }) => {
    setFoldersStates({
      ...foldersStates,
      [id]: false,
    });
  }, [foldersStates]);

  const contents = useMemo(() => [
    ...folders.map((folder) => {
      if (folder.id in foldersStates) {
        const isExpanded = foldersStates[folder.id];
        return {
          ...folder,
          isExpanded,
          icon: isExpanded ? 'folder-open' : 'folder-close',
        }
      }
      return folder;
    }),
    ...items,
  ], [folders, items, foldersStates]);

  return (
    <Tree
      {...otherProps}
      contents={contents}
      onNodeExpand={nodeExpandHandler}
      onNodeCollapse={nodeCollapseHandler}
    />
  );
}
