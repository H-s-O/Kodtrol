import React, { useMemo, useCallback } from 'react';
import { Button, ButtonGroup, Position, Popover, Menu, Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import LayerEditor from '../../layer_editor/LayerEditor';
import BoardItem from './BoardItem';
import percentString from '../../../lib/percentString';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledTopRow = styled.div`
  margin-bottom: 5px;
`;

const StyledBottomRow = styled.div`
  height: 100%;
  overflow: auto;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  margin-right: 5px;
`;

const BoardLayerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const BoardLayer = ({ id, items = [], scriptsNames }) => {
  return (
    <BoardLayerContainer>
      {items.map((item) => (
        <BoardItem
          key={item.id}
          item={item}
          scriptsNames={scriptsNames}
        />
      ))}
    </BoardLayerContainer>
  );
};

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function BoardEditor({ board, onChange }) {
  const { items, layers, zoom, zoomVert } = board;

  const scripts = useSelector((state) => state.scripts)

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const availableLayers = useMemo(() => {
    return layers.map(({ id, order }) => ({ id, name: order + 1 }));
  }, [board]);
  const itemsByLayer = useMemo(() => {
    return items.reduce((obj, item) => {
      if (!(item.layer in obj)) {
        obj[item.layer] = [];
      }
      obj[item.layer].push(item);
      return obj;
    }, {});
  }, [board]);

  // Zoom
  const zoomClickHandler = useCallback((value) => {
    onChange({ zoom: value });
  }, [onChange, board]);
  const zoomVertClickHandler = useCallback((value) => {
    onChange({ zoomVert: value });
  }, [onChange, board]);

  // Layers
  const layerChildrenRenderer = useCallback((id) => {
    return (
      <BoardLayer
        id={id}
        items={itemsByLayer[id]}
        scriptsNames={scriptsNames}
      />
    );
  }, [board, itemsByLayer, scriptsNames]);

  return (
    <StyledContainer>
      <StyledTopRow>
        <StyledButtonGroup>
          <Popover
            minimal
            position={Position.BOTTOM}
            content={(
              <Menu>
                {ZOOM_LEVELS.map((level) => (
                  <Menu.Item
                    key={level}
                    active={zoom === level}
                    text={percentString(level, true)}
                    onClick={() => zoomClickHandler(level)}
                  />
                ))}
              </Menu>
            )}
          >
            <Button
              small
              icon="search"
              rightIcon="caret-down"
            >
              <Icon
                icon="arrows-horizontal"
              />
            </Button>
          </Popover>
        </StyledButtonGroup>
        <StyledButtonGroup>
          <Popover
            minimal
            position={Position.BOTTOM}
            content={(
              <Menu>
                {ZOOM_LEVELS.map((level) => (
                  <Menu.Item
                    key={level}
                    active={zoomVert === level}
                    text={percentString(level, true)}
                    onClick={() => zoomVertClickHandler(level)}
                  />
                ))}
              </Menu>
            )}
          >
            <Button
              small
              icon="search"
              rightIcon="caret-down"
            >
              <Icon
                icon="arrows-vertical"
              />
            </Button>
          </Popover>
        </StyledButtonGroup>
      </StyledTopRow>
      <StyledBottomRow>
        <div
          style={{
            width: percentString(zoom),
            height: percentString(zoomVert),
          }}
        >
          <LayerEditor
            layers={layers}
            renderLayerChildren={layerChildrenRenderer}
          />
        </div>
      </StyledBottomRow>
    </StyledContainer>
  );
}
