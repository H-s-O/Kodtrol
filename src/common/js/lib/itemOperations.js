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
