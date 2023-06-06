import uniqid from 'uniqid';

import orderSort from './orderSort';

export const getLayer = (layers, layerId) => {
  const layer = layers.find(({ id }) => id === layerId);
  return layer;
};

export const sortLayers = (layers) => {
  const sortedLayers = layers
    .sort(orderSort)
    .map((layer, index) => {
      return {
        ...layer,
        order: index,
      };
    });

  return sortedLayers;
};

export const doAddLayer = (layers, index) => {
  const newLayer = {
    id: uniqid(),
  };

  if (index === 'max') {
    newLayer.order = layers.length;
  } else if (index === 'min') {
    newLayer.order = -0.5;
  } else {
    newLayer.order = index - 0.5;
  }

  const newLayers = sortLayers([
    ...layers,
    newLayer,
  ]);

  return newLayers;
};

export const doMoveLayer = (layers, layerId, offset) => {
  const layer = layers.find(({ id }) => id === layerId);

  const newOrder = layer.order + (offset * 1.5);
  // Guard
  if (newOrder < -1 || newOrder > layers.length) {
    return layers;
  }

  const newLayers = sortLayers(layers.map((layer) => {
    if (layer.id === layerId) {
      return {
        ...layer,
        order: newOrder,
      };
    }
    return layer;
  }));

  return newLayers;
};

export const canMoveLayerUp = (layers, layerId) => {
  const layer = layers.find(({ id }) => id === layerId);
  const canIt = layer.order < layers.length - 1;
  return canIt;
};

export const canMoveLayerDown = (layers, layerId) => {
  const layer = layers.find(({ id }) => id === layerId);
  const canIt = layer.order > 0;
  return canIt;
};

export const doDeleteLayer = (layers, layerId) => {
  const newLayers = sortLayers(layers.filter(({ id }) => id !== layerId));
  return newLayers;
};
