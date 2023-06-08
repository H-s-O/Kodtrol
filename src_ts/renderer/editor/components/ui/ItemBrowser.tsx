import React, { useCallback, useMemo, ComponentType } from 'react';
import styled from 'styled-components';
import { ok } from 'assert';
import { Menu, MenuItem, TreeNodeInfo, ContextMenu, TreeEventHandler } from '@blueprintjs/core';

import ManagedTree from './ManagedTree';
import { Board, Device, Folder, Media, Script, Timeline } from '../../../../common/types';

const DEFAULT_ITEM_PROPS_FILTER = ({ id, name }) => ({ id, name });

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

type BrowsableTypes = Device | Script | Media | Timeline | Board;

type LabelComponent<T extends BrowsableTypes = BrowsableTypes> = ComponentType<{
  item: T | { [K in keyof T]: T[K] }
  activeItemId: T['id'] | null | undefined
}>;

type ItemBrowserProps<T extends BrowsableTypes = BrowsableTypes> = {
  items?: T[]
  folders?: Folder[]
  activeItemId?: T['id'] | null
  label: string
  editCallback?: (id: T['id']) => any
  editPropsCallback?: (id: T['id']) => any
  duplicateCallback?: (id: T['id']) => any
  deleteCallback?: (id: T['id']) => any
  itemLabelComponent?: LabelComponent<T>
  itemSecondaryLabelComponent?: LabelComponent<T>
  enableEdit?: boolean
  enableDuplicate?: boolean
  enableDelete?: boolean
  itemPropsFilter?: (item: T) => { [K in keyof T]: T[K] }
};

export default function ItemBrowser<T extends BrowsableTypes = BrowsableTypes>({
  items = [],
  folders = [],
  activeItemId,
  label,
  editCallback,
  editPropsCallback,
  duplicateCallback,
  deleteCallback,
  itemLabelComponent: LabelComponent,
  itemSecondaryLabelComponent: SecondaryLabelComponent,
  enableEdit = true,
  enableDuplicate = true,
  enableDelete = true,
  itemPropsFilter = DEFAULT_ITEM_PROPS_FILTER,
}: ItemBrowserProps<T>) {
  const editPropsClickHandler = useCallback((id: T['id']) => {
    if (editPropsCallback) {
      editPropsCallback(id);
    }
  }, [editPropsCallback]);
  const duplicateClickHandler = useCallback((id: T['id']) => {
    if (duplicateCallback) {
      duplicateCallback(id);
    }
  }, [duplicateCallback]);
  const deleteClickHandler = useCallback((id: T['id']) => {
    if (deleteCallback) {
      const item = items.find((item) => item.id === id);
      ok(item, 'item not found');
      window.kodtrol_editor.deleteWarningDialog(`Are you sure you want to delete ${item.name}?`)
        .then((result) => {
          if (result) {
            deleteCallback(id);
          }
        });
    }
  }, [deleteCallback, items]);
  const nodeContextMenuHandler: TreeEventHandler = useCallback(({ id, hasCaret }, nodePath, event) => {
    const menu = (
      <Menu>
        <MenuItem
          text={`Edit ${label} properties...`}
          onClick={() => editPropsClickHandler(id)}
          disabled={!enableEdit}
        />
        <MenuItem
          text={`Duplicate ${label}...`}
          onClick={() => duplicateClickHandler(id)}
          disabled={!enableDuplicate}
        />
        <MenuItem
          text={`Delete ${label}...`}
          onClick={() => deleteClickHandler(id)}
          disabled={!enableDelete}
        />
      </Menu>
    )
    ContextMenu.show(menu, { left: event.clientX, top: event.clientY });
  }, [editPropsCallback, duplicateCallback, deleteCallback, enableEdit, enableDuplicate, enableDelete]);
  const nodeDoubleClickHandler: TreeEventHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      if (editCallback) {
        editCallback(id);
      }
    }
  }, [editCallback]);

  const treeItems = useMemo(() => {
    return items.map((item) => {
      const { id, name } = item;
      const filteredProps = itemPropsFilter(item);
      return {
        id,
        key: id,
        label: !LabelComponent ? name : (
          <LabelComponent
            item={filteredProps}
            activeItemId={activeItemId}
          />
        ),
        secondaryLabel: SecondaryLabelComponent && (
          <SecondaryLabelComponent
            item={filteredProps}
            activeItemId={activeItemId}
          />
        ),
      } as TreeNodeInfo;
    });
  }, [items, activeItemId, LabelComponent, SecondaryLabelComponent, itemPropsFilter]);
  const treeFolders = useMemo(() => {
    return folders.map(({ id, name }) => ({
      id,
      key: id,
      label: name,
      hasCaret: true,
      isExpanded: false,
      icon: 'folder-close',
    } as TreeNodeInfo))
  }, [folders]);

  return (
    <StyledContainer>
      <ManagedTree
        items={treeItems}
        folders={treeFolders}
        onNodeContextMenu={nodeContextMenuHandler}
        onNodeDoubleClick={nodeDoubleClickHandler}
      />
    </StyledContainer>
  );
};
