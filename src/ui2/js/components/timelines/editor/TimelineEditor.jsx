import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ButtonGroup, Button, Popover, Menu, Position, Icon } from '@blueprintjs/core';
import uniqid from 'uniqid';
import { useSelector } from 'react-redux';
import { remote } from 'electron';

import LayerEditor from '../../layer_editor/LayerEditor';
import { ICON_SCRIPT, ICON_MEDIA, ICON_CURVE, ICON_TRIGGER, ICON_LAYER } from '../../../../../common/js/constants/icons';
import percentString from '../../../lib/percentString';
import { doAddLayer, doDeleteLayer } from '../../layer_editor/layerOperations';
import { doAddItem, doUpdateItem, getItem } from './timelineOperations';
import { deleteWarning } from '../../../lib/dialogHelpers';
import TimelineScriptDialog from './TimelineScriptDialog';
import { DIALOG_EDIT } from '../../../../../common/js/constants/dialogs';
import useDialog from '../../../lib/useDialog';
import { ITEM_SCRIPT, ITEM_TRIGGER } from '../../../../../common/js/constants/items';
import TimelineTriggerDialog from './TimelineTriggerDialog';
import TimelineItem from './TimelineItem';

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

const TimelineLayer = ({
  id,
  items = [],
  scriptsNames,
  timelineDuration,
  onItemContextMenu,
}) => {
  return items.map((item) => (
    <TimelineItem
      key={item.id}
      item={item}
      scriptsNames={scriptsNames}
      timelineDuration={timelineDuration}
      onContextMenu={(e) => onItemContextMenu(e, item.id)}
    />
  ));
};

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function TimelineEditor({ timeline, onChange }) {
  const { duration, layers, items, zoom, zoomVert } = timeline;

  const scripts = useSelector((state) => state.scripts);
  const runTimeline = useSelector((state) => state.runTimeline);
  const timelineInfo = useSelector((state) => state.timelineInfo);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const availableScripts = useMemo(() => {
    return scripts.map(({ id, name }) => ({ id, name }));
  }, [scripts]);
  const availableLayers = useMemo(() => {
    return layers.map(({ id, order }) => ({ id, name: order + 1 }));
  }, [timeline]);
  const itemsByLayer = useMemo(() => {
    return items.reduce((obj, item) => {
      if (!(item.layer in obj)) {
        obj[item.layer] = [];
      }
      obj[item.layer].push(item);
      return obj;
    }, {})
  }, [timeline]);

  const scriptDialog = useDialog();
  const triggerDialog = useDialog();

  // Zoom
  const zoomClickHandler = useCallback((value) => {
    onChange({ zoom: value });
  }, [onChange, timeline]);
  const zoomVertClickHandler = useCallback((value) => {
    onChange({ zoomVert: value });
  }, [onChange, timeline]);

  // Scripts
  const addScriptClickHandler = useCallback(() => {
    scriptDialog.show();
  }, [scriptDialog]);
  const editScriptClickHandler = useCallback((id) => {
    const script = getItem(items, id);
    scriptDialog.show(DIALOG_EDIT, script);
  }, [scriptDialog, timeline]);
  const scriptDialogSuccessHandler = useCallback(() => {
    if (scriptDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, scriptDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...scriptDialog.value, id: uniqid(), type: ITEM_SCRIPT }) });
    }
    scriptDialog.hide();
  }, [onChange, scriptDialog]);

  // Triggers
  const addTriggerClickHandler = useCallback(() => {
    triggerDialog.show();
  }, [triggerDialog]);
  const editTriggerClickHandler = useCallback((id) => {
    const trigger = getItem(items, id);
    triggerDialog.show(DIALOG_EDIT, trigger);
  }, [triggerDialog, timeline]);
  const triggerDialogSuccessHandler = useCallback(() => {
    if (triggerDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, triggerDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...triggerDialog.value, id: uniqid(), type: ITEM_TRIGGER }) });
    }
    triggerDialog.hide();
  }, [onChange, triggerDialog]);

  // Items
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
    if (item.type === ITEM_TRIGGER) {
      template.push({
        label: 'Edit trigger',
        click: () => editTriggerClickHandler(id),
      });
    }

    const menu = remote.Menu.buildFromTemplate(template);
    menu.popup();
  }, [timeline, editScriptClickHandler]);

  // Layers
  const addLayerAtTopClickHandler = useCallback(() => {
    onChange({ layers: doAddLayer(layers, 'max') });
  }, [onChange, timeline]);
  const addLayerAtBottomClickHandler = useCallback(() => {
    onChange({ layers: doAddLayer(layers, 'min') });
  }, [onChange, timeline]);
  const layersChangerHandler = useCallback((layers) => {
    onChange({ layers });
  }, [onChange, timeline]);
  const layersDeleteHandler = useCallback((id) => {
    const layer = layers.find((layer) => layer.id === id);
    deleteWarning(`Are you sure you want to delete layer ${layer.order + 1}?`).then((result) => {
      if (result) {
        onChange({ layers: doDeleteLayer(layers, id) });
      }
    });
  }, [onChange, timeline]);
  const layerChildrenRenderer = useCallback((id) => {
    return (
      <TimelineLayer
        id={id}
        items={itemsByLayer[id]}
        scriptsNames={scriptsNames}
        timelineDuration={duration}
        onItemContextMenu={itemContextMenuHandler}
      />
    );
  }, [timeline, itemsByLayer, scriptsNames, itemContextMenuHandler]);

  return (
    <>
      <StyledContainer>
        <StyledTopRow>
          <StyledButtonGroup>
            <Button
              small
              icon="step-backward"
              disabled={runTimeline !== timeline.id}
            />
            <Button
              small
              icon="play"
              disabled={runTimeline !== timeline.id}
            />
          </StyledButtonGroup>
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
                    </>
                  ) : (
                      <Menu.Item
                        icon={ICON_LAYER}
                        text="Add Layer"
                        onClick={addLayerAtBottomClickHandler}
                      />
                    )}
                  <Menu.Divider />
                  <Menu.Item
                    icon={ICON_SCRIPT}
                    text="Add Script block"
                    onClick={addScriptClickHandler}
                  />
                  <Menu.Item
                    icon={ICON_TRIGGER}
                    text="Add Trigger"
                    onClick={addTriggerClickHandler}
                  />
                  <Menu.Item
                    icon={ICON_CURVE}
                    text="Add Curve block"
                  />
                  <Menu.Item
                    icon={ICON_MEDIA}
                    text="Add Media block"
                  />
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
      <TimelineScriptDialog
        opened={scriptDialog.opened}
        mode={scriptDialog.mode}
        value={scriptDialog.value}
        onChange={scriptDialog.change}
        onSuccess={scriptDialogSuccessHandler}
        onClose={scriptDialog.hide}
        layers={availableLayers}
        scripts={availableScripts}
      />
      <TimelineTriggerDialog
        opened={triggerDialog.opened}
        mode={triggerDialog.mode}
        value={triggerDialog.value}
        onChange={triggerDialog.change}
        onSuccess={triggerDialogSuccessHandler}
        onClose={triggerDialog.hide}
        layers={availableLayers}
      />
    </>
  )
}
