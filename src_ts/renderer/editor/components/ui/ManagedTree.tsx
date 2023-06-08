import React, { useState, useMemo, useCallback } from 'react';
import { Tree, TreeEventHandler, TreeNodeInfo, TreeProps } from '@blueprintjs/core';

type ManagedTreeProps = Omit<TreeProps, 'contents' | 'onNodeExpand' | 'onNodeCollapse'> & {
  items?: TreeNodeInfo[]
  folders?: TreeNodeInfo[]
};

type InitialFolders = {
  [id: TreeNodeInfo['id']]: boolean
}

export default function ManagedTree({
  items = [],
  folders = [],
  ...otherProps
}: ManagedTreeProps) {
  const initialFoldersStates = useMemo(() => folders.reduce((obj, { id, isExpanded = false }) => ({
    ...obj,
    [id]: isExpanded,
  }), {} as InitialFolders), [folders]);

  const [foldersStates, setFoldersStates] = useState(initialFoldersStates);
  const nodeExpandHandler: TreeEventHandler = useCallback(({ id }) => {
    setFoldersStates({
      ...foldersStates,
      [id]: true,
    });
  }, [foldersStates]);
  const nodeCollapseHandler: TreeEventHandler = useCallback(({ id }) => {
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
        } as TreeNodeInfo
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
};
