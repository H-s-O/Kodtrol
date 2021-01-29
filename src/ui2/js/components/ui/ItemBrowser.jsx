import React, { useCallback, useMemo } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';

import ManagedTree from '../ui/ManagedTree';
import { deleteWarning } from '../../lib/messageBoxes';

const DEFAULT_ITEM_PROPS_FILTER = ({ id, name }) => ({ id, name });

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default function ItemBrowser({
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
}) {
  const editPropsClickHandler = useCallback((id) => {
    if (editPropsCallback) {
      editPropsCallback(id);
    }
  }, [editPropsCallback]);
  const duplicateClickHandler = useCallback((id) => {
    if (duplicateCallback) {
      duplicateCallback(id);
    }
  }, [duplicateCallback]);
  const deleteClickHandler = useCallback((id) => {
    if (deleteCallback) {
      const item = items.find((item) => item.id === id);
      deleteWarning(`Are you sure you want to delete ${item.name}?`, (result) => {
        if (result) {
          deleteCallback(id);
        }
      });
    }
  }, [deleteCallback, items]);
  const nodeContextMenuHandler = useCallback(({ id, hasCaret }) => {
    let template = [];
    if (!hasCaret) {
      if (editPropsCallback) {
        template.push({
          label: `Edit ${label} properties...`,
          click: () => editPropsClickHandler(id),
          enabled: enableEdit,
        });
      }
      if (duplicateCallback) {
        template.push({
          label: `Duplicate ${label}...`,
          click: () => duplicateClickHandler(id),
          enabled: enableDuplicate,
        });
      }
      if (deleteCallback) {
        template.push({
          label: `Delete ${label}...`,
          click: () => deleteClickHandler(id),
          enabled: enableDelete,
        });
      }
    }
    const menu = remote.Menu.buildFromTemplate(template);
    menu.popup();
  }, [editPropsCallback, duplicateCallback, deleteCallback, enableEdit, enableDuplicate, enableDelete]);
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
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
      };
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
    }))
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
}
