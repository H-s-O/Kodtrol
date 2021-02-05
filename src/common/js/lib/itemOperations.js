import uniqid from 'uniqid';

import { clipboardGetMode, clipboardPut, clipboardGetValue } from '../../../ui/js/lib/customClipboard';

export const getItem = (items, itemId) => {
  const item = items.find(({ id }) => id === itemId);
  return item;
};

export const getItemsOfLayer = (items, layerId) => {
  const layerItems = items.find(({ layer }) => layer === layerId);
  return layerItems;
};

export const doAddItem = (items, item) => {
  const newItems = [...items, item];
  return newItems;
};

export const doAddItems = (items, addedItems) => {
  const newItems = [...items, ...addedItems];
  return newItems;
};

export const doUpdateItem = (items, item) => {
  const newItems = items.map((obj) => obj.id === item.id ? item : obj);
  return newItems;
};

export const doDeleteItem = (items, itemId) => {
  const newItems = items.filter(({ id }) => id !== itemId);
  return newItems;
};

export const doDeleteItemsOfLayer = (items, layerId) => {
  const newItems = items.filter(({ layer }) => layer !== layerId);
  return newItems;
};

export const canChangeItemLayerUp = (items, layers, itemId) => {
  const item = items.find(({ id }) => id === itemId);
  const layerId = item.layer;
  const layer = layers.find(({ id }) => id === layerId);
  const canIt = layer.order < layers.length - 1;
  return canIt;
};

export const canChangeItemLayerDown = (items, layers, itemId) => {
  const item = items.find(({ id }) => id === itemId);
  const layerId = item.layer;
  const layer = layers.find(({ id }) => id === layerId);
  const canIt = layer.order > 0;
  return canIt;
};

export const doChangeItemLayer = (items, layers, itemId, offset) => {
  const item = items.find(({ id }) => id === itemId);
  const layerId = item.layer;
  const layer = layers.find(({ id }) => id === layerId);

  const newOrder = layer.order + offset;
  // Guard
  if (newOrder < 0 || newOrder >= layers.length) {
    return items;
  }

  const newLayer = layers.find(({ order }) => order === newOrder);

  const newItems = items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        layer: newLayer.id,
      };
    }
    return item;
  });

  return newItems;
};

export const canPasteItem = (mode) => {
  const copyItemMode = clipboardGetMode();
  if (mode === 'item' && copyItemMode === 'item') {
    return true;
  } else if (mode === 'inTime' && (copyItemMode === 'inTime' || copyItemMode === 'outTime')) {
    return true;
  } else if (mode === 'outTime' && (copyItemMode === 'inTime' || copyItemMode === 'outTime')) {
    return true;
  } else if (mode === 'inAndOutTime' && copyItemMode === 'inAndOutTime') {
    return true;
  }
  return false;
};

export const doCopy = (items, itemId, mode) => {
  const item = items.find(({ id }) => id === itemId);
  let data;
  if (mode === 'item') {
    data = { ...item };
  } else if (mode === 'inTime') {
    data = item.inTime;
  } else if (mode === 'outTime') {
    data = item.outTime;
  } else if (mode === 'inAndOutTime') {
    data = { inTime: item.inTime, outTime: item.outTime };
  }
  clipboardPut(mode, data);
};

export const doPaste = (items, itemId, mode, layerId, newInTime, maxTime) => {
  const copyItemData = clipboardGetValue();

  // Guard
  if (copyItemData === null) {
    return items;
  }

  let newItem;
  let newItems;
  if (mode === 'item') {
    const { inTime } = copyItemData;
    if (newInTime < 0) {
      newInTime = 0;
    } else if (newInTime > maxTime) {
      newInTime = maxTime;
    }
    newItem = {
      ...copyItemData,
      id: uniqid(), // override with new id
      layer: layerId,
      inTime: newInTime,
    }
    if ('outTime' in copyItemData) {
      const diffTime = copyItemData.outTime - inTime;
      let newOutTime = newInTime + diffTime;
      if (newOutTime < 0) {
        newOutTime = 0;
      } else if (newOutTime > maxTime) {
        newOutTime = maxTime;
      }
      newItem.outTime = newOutTime;
    }
    newItems = [
      ...items,
      newItem,
    ];
  } else if (mode === 'inAndOutTime') {
    const item = items.find(({ id }) => id === itemId);
    newItem = {
      ...item,
      ...copyItemData,
    };
    newItems = items.map((item) => {
      if (item.id === itemId) {
        return newItem;
      }
      return item;
    });
  } else {
    const item = items.find(({ id }) => id === itemId);
    newItem = {
      ...item,
      [mode]: copyItemData,
    };
    newItems = items.map((item) => {
      if (item.id === itemId) {
        return newItem;
      }
      return item;
    });
  }

  return newItems;
};
