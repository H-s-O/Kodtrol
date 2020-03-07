import React, { useCallback, useMemo, useRef, useEffect } from 'react';
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
import { ITEM_SCRIPT, ITEM_TRIGGER, ITEM_MEDIA } from '../../../../../common/js/constants/items';
import TimelineTriggerDialog from './TimelineTriggerDialog';
import TimelineItem from './TimelineItem';
import TimelineMediaDialog from './TimelineMediaDialog';
import { getMediaName } from '../../../../../common/js/lib/itemNames';
import { getContainerX, getContainerPercent } from '../../../lib/mouseEvents';

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

const StyledZoomContainer = styled.div`
  position: relative;

  & > * {
    position: absolute;
    top: 0px;
    left: 0px;
  }
`;

const StyledMouseTracker = styled.div`
  width: 1px;
  height: 100%;
  background-color: #AAA;
  z-index: 15;
  pointer-events: none;
`

const TimelineLayer = ({
  id,
  items = [],
  scriptsNames,
  mediasNames,
  timelineDuration,
  onItemDrag,
  onItemContextMenu,
}) => {
  return items.map((item) => (
    <TimelineItem
      key={item.id}
      item={item}
      scriptsNames={scriptsNames}
      mediasNames={mediasNames}
      timelineDuration={timelineDuration}
      onDrag={(e, element, mode) => onItemDrag(e, item.id, element, mode)}
      onContextMenu={(e) => onItemContextMenu(e, item.id)}
    />
  ));
};

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function TimelineEditor({ timeline, onChange }) {
  const { duration, layers, items, zoom, zoomVert } = timeline;

  const scripts = useSelector((state) => state.scripts);
  const medias = useSelector((state) => state.medias);
  const runTimeline = useSelector((state) => state.runTimeline);
  const timelineInfo = useSelector((state) => state.timelineInfo);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const availableScripts = useMemo(() => {
    return scripts.map(({ id, name }) => ({ id, name }));
  }, [scripts]);
  const mediasNames = useMemo(() => {
    return medias.reduce((obj, media) => ({ ...obj, [media.id]: { name: getMediaName(media), file: media.file } }), {});
  }, [medias]);
  const availableMedias = useMemo(() => {
    return medias.map((media) => ({ id: media.id, name: getMediaName(media) }));
  }, [medias]);
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
  const mediaDialog = useDialog();

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

  // Medias
  const addMediaClickHandler = useCallback(() => {
    mediaDialog.show();
  }, [mediaDialog]);
  const editMediaClickHandler = useCallback((id) => {
    const media = getItem(items, id);
    mediaDialog.show(DIALOG_EDIT, media);
  }, [mediaDialog, timeline]);
  const mediaDialogSuccessHandler = useCallback(() => {
    if (mediaDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, mediaDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...mediaDialog.value, id: uniqid(), type: ITEM_MEDIA }) });
    }
    mediaDialog.hide();
  }, [onChange, mediaDialog]);

  // Items
  const dragContent = useRef(null);
  const itemDragStartHandler = useCallback((e, id, element, mode) => {
    // Ignore when related to onContextMenu
    if (e.button !== 0) {
      return;
    }

    e.stopPropagation();

    dragContent.current = {
      item: getItem(items, id),
      mode,
      element,
    };
    document.body.style = 'cursor:ew-resize;';
  }, [dragContent, timeline]);
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
    if (item.type === ITEM_MEDIA) {
      template.push({
        label: 'Edit media block',
        click: () => editMediaClickHandler(id),
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
        mediasNames={mediasNames}
        timelineDuration={duration}
        onItemDrag={itemDragStartHandler}
        onItemContextMenu={itemContextMenuHandler}
      />
    );
  }, [timeline, itemsByLayer, scriptsNames, itemDragStartHandler, itemContextMenuHandler]);

  // Zoom container & trackers
  const mouseTracker = useRef();
  const zoomContainerMouseMoveHandler = useCallback((e) => {
    if (mouseTracker.current) {
      mouseTracker.current.style = `left:${getContainerX(e)}px`;
    }
    if (dragContent.current) {
      const { mode, element, item } = dragContent.current;
      const percent = getContainerPercent(e);
      if (mode === 'inTime') {
        if (item.type === ITEM_TRIGGER) {
          element.style = `left:${percentString(percent)}`;
        } else {
          element.style = `left:${percentString(percent)};width:${percentString((item.outTime / duration) - percent)}`;
        }
      } else if (mode === 'outTime') {
        element.style = `left:${percentString(item.inTime / duration)};width:${percentString(percent - (item.inTime / duration))}`;
      }
      dragContent.current.percent = percent;
    }
  }, [mouseTracker.current, dragContent.current, timeline]);
  const windowMouseUpHandler = useCallback((e) => {
    if (dragContent.current) {
      const { mode, element, item, percent } = dragContent.current;
      // element.style = undefined;
      if (mode === 'inTime') {
        onChange({ items: doUpdateItem(items, { ...item, inTime: Math.round(duration * percent) }) });
      } else if (mode === 'outTime') {
        onChange({ items: doUpdateItem(items, { ...item, outTime: Math.round(duration * percent) }) });
      }
      dragContent.current = null;
      document.body.style = 'cursor:initial;';
    }
  }, [dragContent.current, timeline, onChange]);
  useEffect(() => {
    window.addEventListener('mouseup', windowMouseUpHandler);
    return () => window.removeEventListener('mouseup', windowMouseUpHandler);
  }, [windowMouseUpHandler]);

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
                    onClick={addMediaClickHandler}
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
          <StyledZoomContainer
            style={{
              width: percentString(zoom),
              height: percentString(zoomVert),
            }}
            onMouseMove={zoomContainerMouseMoveHandler}
          >
            <LayerEditor
              layers={layers}
              renderLayerChildren={layerChildrenRenderer}
              onChange={layersChangerHandler}
              onDelete={layersDeleteHandler}
            />
            <StyledMouseTracker
              ref={mouseTracker}
            />
          </StyledZoomContainer>
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
      <TimelineMediaDialog
        opened={mediaDialog.opened}
        mode={mediaDialog.mode}
        value={mediaDialog.value}
        onChange={mediaDialog.change}
        onSuccess={mediaDialogSuccessHandler}
        onClose={mediaDialog.hide}
        layers={availableLayers}
        medias={availableMedias}
      />
    </>
  )
}
