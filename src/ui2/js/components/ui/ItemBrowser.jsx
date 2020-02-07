import React, { useCallback, useMemo } from 'react';
import { remote } from 'electron';

import ManagedTree from '../ui/ManagedTree';
import { deleteWarning } from '../../../../ui/js/lib/messageBoxes';

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
  extraComponentProp,
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
        });
      }
      if (duplicateCallback) {
        template.push({
          label: `Duplicate ${label}...`,
          click: () => duplicateClickHandler(id),
        });
      }
      if (deleteCallback) {
        template.push({
          label: `Delete ${label}...`,
          click: () => deleteClickHandler(id),
        });
      }
    }
    const menu = remote.Menu.buildFromTemplate(template);
    menu.popup();
  }, [editPropsCallback, duplicateCallback, deleteCallback]);
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
      return {
        id,
        key: id,
        label: !LabelComponent ? name : (
          <LabelComponent
            id={id}
            name={name}
            activeItemId={activeItemId}
            {...(extraComponentProp ? { [extraComponentProp]: item[extraComponentProp] } : undefined)}
          />
        ),
        secondaryLabel: SecondaryLabelComponent && (
          <SecondaryLabelComponent
            id={id}
            name={name}
            activeItemId={activeItemId}
            {...(extraComponentProp ? { [extraComponentProp]: item[extraComponentProp] } : undefined)}
          />
        ),
      };
    });
  }, [items, activeItemId, LabelComponent, SecondaryLabelComponent, extraComponentProp]);
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
    <ManagedTree
      items={treeItems}
      folders={treeFolders}
      onNodeContextMenu={nodeContextMenuHandler}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}