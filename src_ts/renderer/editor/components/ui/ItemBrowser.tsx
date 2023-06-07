import React, { useCallback, useMemo, JSX } from 'react';
import styled from 'styled-components';
import { ok } from 'assert';
import { Menu, MenuItem, TreeNodeInfo, ContextMenu, TreeEventHandler } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { MenuItemConstructorOptions } from 'electron/renderer';

import ManagedTree from './ManagedTree';
import { deleteWarning } from '../../lib/messageBoxes';
import { Board, Device, Folder, Media, Script, Timeline } from '../../../../common/types';

const DEFAULT_ITEM_PROPS_FILTER = ({ id, name }) => ({ id, name });

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

type BrowsableTypes = Device | Script | Media | Timeline | Board;

type ItemBrowserProps<T extends BrowsableTypes = BrowsableTypes> = {
  items?: T[]
  folders?: Folder[]
  activeItemId: T['id']
  label: string
  editCallback?: (id: T['id']) => void
  editPropsCallback?: (id: T['id']) => void
  duplicateCallback?: (id: T['id']) => void
  deleteCallback?: (id: T['id']) => void
  itemLabelComponent?: JSX.Element
  itemSecondaryLabelComponent?: JSX.Element
  enableEdit?: boolean
  enableDuplicate?: boolean
  enableDelete?: boolean
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
    // let template: MenuItemConstructorOptions[] = [];
    // if (!hasCaret) {
    //   if (editPropsCallback) {
    //     template.push({
    //       label: `Edit ${label} properties...`,
    //       click: () => editPropsClickHandler(id),
    //       enabled: enableEdit,
    //     });
    //   }
    //   if (duplicateCallback) {
    //     template.push({
    //       label: `Duplicate ${label}...`,
    //       click: () => duplicateClickHandler(id),
    //       enabled: enableDuplicate,
    //     });
    //   }
    //   if (deleteCallback) {
    //     template.push({
    //       label: `Delete ${label}...`,
    //       click: () => deleteClickHandler(id),
    //       enabled: enableDelete,
    //     });
    //   }
    // }
    // const menu = window.kodtrol_editor.menuFromTemplate(template);
    // menu.popup();
    const menu = (
      <Menu>
        <MenuItem
          text={`Edit ${label} properties...`}
          disabled={!enableEdit}
        />
        <MenuItem
          text={`Duplicate ${label}...`}
          disabled={!enableDuplicate}
        />
        <MenuItem
          text={`Delete ${label}...`}
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
