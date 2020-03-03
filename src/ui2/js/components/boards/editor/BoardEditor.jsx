import React, { useMemo, useCallback } from 'react';
import { Button, ButtonGroup, Position, Popover, Menu, Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { remote } from 'electron';

import LayerEditor from '../../layer_editor/LayerEditor';
import BoardItem from './BoardItem';
import percentString from '../../../lib/percentString';
import { doAddLayer, doDeleteLayer } from '../../layer_editor/layerOperations';
import { deleteWarning } from '../../../lib/dialogHelpers';
import { ICON_LAYER, ICON_SCRIPT } from '../../../../../common/js/constants/icons';
import { DIALOG_EDIT } from '../../../../../common/js/constants/dialogs';
import { ITEM_SCRIPT, ITEM_BEHAVIOR_TOGGLE } from '../../../../../common/js/constants/items';
import useDialog from '../../../lib/useDialog';
import BoardScriptDialog from './BoardScriptDialog';
import { getItem, doUpdateItem } from '../../timelines/editor/timelineOperations';
import { ipcRendererSend } from '../../../lib/ipcRenderer';
import { UPDATE_BOARD_INFO } from '../../../../../common/js/constants/events';

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

const BoardLayer = ({
  id,
  items = [],
  scriptsNames,
  onItemMouseDown,
  onItemMouseUp,
  onItemContextMenu,
}) => {
  return (
    <BoardLayerContainer>
      {items.map((item) => (
        <BoardItem
          key={item.id}
          item={item}
          scriptsNames={scriptsNames}
          onMouseDown={(e) => onItemMouseDown(e, item.id)}
          onMouseUp={(e) => onItemMouseUp(e, item.id)}
          onContextMenu={(e) => onItemContextMenu(e, item.id)}
        />
      ))}
    </BoardLayerContainer>
  );
};

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function BoardEditor({ board, onChange }) {
  const { items, layers, zoom, zoomVert } = board;

  const scripts = useSelector((state) => state.scripts);
  const runBoard = useSelector((state) => state.runBoard);
  const boardInfo = useSelector((state) => state.boardInfo);

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

  const scriptDialog = useDialog();

  // Zoom
  const zoomClickHandler = useCallback((value) => {
    onChange({ zoom: value });
  }, [onChange, board]);
  const zoomVertClickHandler = useCallback((value) => {
    onChange({ zoomVert: value });
  }, [onChange, board]);

  // Scripts
  const addScriptClickHandler = useCallback(() => {
    scriptDialog.show();
  }, [scriptDialog]);
  const editScriptClickHandler = useCallback((id) => {
    const script = getItem(items, id);
    scriptDialog.show(DIALOG_EDIT, script);
  }, [scriptDialog, board]);
  const scriptDialogSuccessHandler = useCallback(() => {
    if (scriptDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, scriptDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...scriptDialog.value, id: uniqid(), type: ITEM_SCRIPT }) });
    }
    scriptDialog.hide();
  }, [onChange, scriptDialog]);

  // Items
  const itemMouseDownHandler = useCallback((e, id) => {
    // Ignore when related to onContextMenu
    if (e.button !== 0) {
      return;
    }

    if (runBoard === board.id) {
      e.stopPropagation();

      const item = getItem(items, id);
      const activeItems = boardInfo && boardInfo.activeItems ? boardInfo.activeItems : {};
      const data = {
        activeItems: {
          ...activeItems,
          [id]: item.behavior === ITEM_BEHAVIOR_TOGGLE ? id in activeItems ? undefined : true : true,
        },
      };

      ipcRendererSend(UPDATE_BOARD_INFO, data);
    }
  }, [board, runBoard, boardInfo]);
  const itemMouseUpHandler = useCallback((e, id) => {
    if (runBoard === board.id) {
      e.stopPropagation();

      const item = getItem(items, id);
      if (item.behavior !== ITEM_BEHAVIOR_TOGGLE) {
        const activeItems = boardInfo && boardInfo.activeItems ? boardInfo.activeItems : {};
        const data = {
          activeItems: {
            ...activeItems,
            [id]: undefined,
          },
        };

        ipcRendererSend(UPDATE_BOARD_INFO, data);
      }
    }
  }, [board, runBoard, boardInfo]);
  const itemContextMenuHandler = useCallback((e, id) => {
    e.stopPropagation();

    const item = getItem(items, id);

    const template = [];
    if (item.type === ITEM_SCRIPT) {
      template.push({
        label: 'Edit script block',
        click: () => editScriptClickHandler(id),
      });
    }

    const menu = remote.Menu.buildFromTemplate(template);
    menu.popup();
  }, [board, editScriptClickHandler]);

  // Layers
  const addLayerAtTopClickHandler = useCallback(() => {
    onChange({ layers: doAddLayer(layers, 'max') });
  }, [onChange, board]);
  const addLayerAtBottomClickHandler = useCallback(() => {
    onChange({ layers: doAddLayer(layers, 'min') });
  }, [onChange, board]);
  const layersChangerHandler = useCallback((layers) => {
    onChange({ layers });
  }, [onChange, board]);
  const layersDeleteHandler = useCallback((id) => {
    const layer = layers.find((layer) => layer.id === id);
    deleteWarning(`Are you sure you want to delete layer ${layer.order + 1}?`).then((result) => {
      if (result) {
        onChange({ layers: doDeleteLayer(layers, id) });
      }
    });
  }, [onChange, board]);
  const layerChildrenRenderer = useCallback((id) => {
    return (
      <BoardLayer
        id={id}
        items={itemsByLayer[id]}
        scriptsNames={scriptsNames}
        onItemMouseDown={itemMouseDownHandler}
        onItemMouseUp={itemMouseUpHandler}
        onItemContextMenu={itemContextMenuHandler}
      />
    );
  }, [board, itemsByLayer, scriptsNames, itemMouseDownHandler, itemMouseUpHandler, itemContextMenuHandler]);

  return (
    <>
      <StyledContainer>
        <StyledTopRow>
          <StyledButtonGroup>
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  {(layers && layers.length > 0) ? (
                    <>
                      <Menu.Item
                        icon={ICON_LAYER}
                        text="Add layer at top"
                        onClick={addLayerAtTopClickHandler}
                      />
                      <Menu.Item
                        icon={ICON_LAYER}
                        text="Add layer at bottom"
                        onClick={addLayerAtBottomClickHandler}
                      />
                      <Menu.Divider />
                      <Menu.Item
                        icon={ICON_SCRIPT}
                        text="Add Script block"
                        onClick={addScriptClickHandler}
                      />
                    </>
                  ) : (
                      <Menu.Item
                        icon={ICON_LAYER}
                        text="Add Layer"
                        onClick={addLayerAtBottomClickHandler}
                      />
                    )}
                </Menu>
              )}
            >
              <Button
                small
                icon="plus"
                rightIcon="caret-down"
              />
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
              onChange={layersChangerHandler}
              onDelete={layersDeleteHandler}
            />
          </div>
        </StyledBottomRow>
      </StyledContainer>
      <BoardScriptDialog
        opened={scriptDialog.opened}
        mode={scriptDialog.mode}
        value={scriptDialog.value}
        layers={availableLayers}
        scripts={scriptsNames}
        onChange={scriptDialog.change}
        onSuccess={scriptDialogSuccessHandler}
        onClose={scriptDialog.hide}
      />
    </>
  );
}
