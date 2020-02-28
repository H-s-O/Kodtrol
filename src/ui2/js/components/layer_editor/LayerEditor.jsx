import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';
import { remote } from 'electron';

import orderSort from '../../../../common/js/lib/orderSort';
import Layer from './Layer';
import { canMoveLayerUp, canMoveLayerDown, doMoveLayer, doAddLayer } from './layerOperations';

const { Menu } = remote;

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;

  width: 100%;
  height: 100%;
  background: ${Colors.DARK_GRAY1};
`;

export default function LayerEditor({ layers = [], onChange, onDelete, renderLayerContextMenu, renderLayerChildren }) {
  const orderedLayers = useMemo(() => {
    return layers.sort(orderSort);
  }, [layers]);

  const moveLayerUpHandler = useCallback((id) => {
    onChange(doMoveLayer(layers, id, 1));
  }, [onChange, layers]);
  const moveLayerDownHandler = useCallback((id) => {
    onChange(doMoveLayer(layers, id, -1));
  }, [onChange, layers]);
  const addLayerAboveHandler = useCallback((id) => {
    onChange(doAddLayer(layers, id, 1));
  }, [onChange, layers]);
  const addLayerBelowHandler = useCallback((id) => {
    onChange(doAddLayer(layers, id));
  }, [onChange, layers]);
  const deleteLayerHandler = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

  const layerContextMenuHandler = useCallback((e, id) => {
    let template = [
      {
        label: 'Move layer up',
        click: () => moveLayerUpHandler(id),
        enabled: canMoveLayerUp(layers, id),
      },
      {
        label: 'Move layer down',
        click: () => moveLayerDownHandler(id),
        enabled: canMoveLayerDown(layers, id),
      },
      {
        type: 'separator',
      },
      {
        label: 'Add layer above',
        click: () => addLayerAboveHandler(id),
      },
      {
        label: 'Add layer below',
        click: () => addLayerBelowHandler(id),
      },
      {
        type: 'separator',
      },
      {
        label: 'Delete layer...',
        click: () => deleteLayerHandler(id),
      },
    ];

    if (renderLayerContextMenu) {
      template = renderLayerContextMenu(template, id, e);
    }

    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  }, [onChange, layers]);

  return (
    <StyledContainer>
      {orderedLayers.map((layer) => (
        <Layer
          key={layer.id}
          layer={layer}
          onContextMenu={layerContextMenuHandler}
        >
          {renderLayerChildren && renderLayerChildren(layer.id)}
        </Layer>
      ))}
    </StyledContainer>
  );
}
