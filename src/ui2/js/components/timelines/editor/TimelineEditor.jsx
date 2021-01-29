import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonGroup, Button, Popover, Menu, Position, Icon, Intent } from '@blueprintjs/core';
import uniqid from 'uniqid';
import { useSelector } from 'react-redux';
import { remote } from 'electron';
import useHotkeys from '@reecelucas/react-use-hotkeys';

import LayerEditor from '../../layer_editor/LayerEditor';
import { ICON_SCRIPT, ICON_MEDIA, ICON_CURVE, ICON_TRIGGER, ICON_LAYER } from '../../../../../common/js/constants/icons';
import percentString from '../../../lib/percentString';
import { doAddLayer, doDeleteLayer } from '../../../../../common/js/lib/layerOperations';
import {
  doAddItem,
  doAddItems,
  doUpdateItem,
  getItem,
  doDeleteItem,
  canChangeItemLayerUp,
  canChangeItemLayerDown,
  doChangeItemLayer,
  canPasteItem,
  doCopy,
  doPaste,
  doDeleteItemsOfLayer,
} from '../../../../../common/js/lib/itemOperations';
import { deleteWarning } from '../../../lib/messageBoxes';
import TimelineScriptDialog from './TimelineScriptDialog';
import { DIALOG_EDIT, DIALOG_ADD, DIALOG_CONFIGURE } from '../../../../../common/js/constants/dialogs';
import useDialog from '../../../lib/useDialog';
import { ITEM_SCRIPT, ITEM_TRIGGER, ITEM_MEDIA, ITEM_CURVE } from '../../../../../common/js/constants/items';
import TimelineTriggerDialog from './TimelineTriggerDialog';
import TimelineItem from './TimelineItem';
import TimelineMediaDialog from './TimelineMediaDialog';
import TimelineCurveDialog from './TimelineCurveDialog';
import TimelineRecordedTriggersDialog from './TimelineRecordedTriggersDialog';
import { getMediaName, getScriptName } from '../../../../../common/js/lib/itemNames';
import { getContainerX, getContainerPercent } from '../../../lib/mouseEvents';
import { ipcRendererListen, ipcRendererClear, ipcRendererSend } from '../../../lib/ipcRenderer';
import { UPDATE_TIMELINE_INFO } from '../../../../../common/js/constants/events';
import focusIsGlobal from '../../../lib/focusIsGlobal';

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

const StyledPositionTracker = styled.div`
  width: 1px;
  height: 100%;
  background-color: #F00;
  z-index: 10;
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
  onItemChange,
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
      onChange={onItemChange}
    />
  ));
};

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function TimelineEditor({ timeline, onChange }) {
  const { duration, layers, items, zoom, zoomVert, recording, recordedTriggers } = timeline;

  const scripts = useSelector((state) => state.scripts);
  const medias = useSelector((state) => state.medias);
  const runTimeline = useSelector((state) => state.runTimeline);

  const isRunning = timeline.id == runTimeline;
  const hasLayers = layers && layers.length > 0;

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
  const curveDialog = useDialog();
  const recordedTriggersDialog = useDialog();

  const mouseTracker = useRef();
  const positionTracker = useRef();
  const timelinePercent = useRef();
  const timelineInfo = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isRunning) {
    // Reset isPlaying and clear timelineInfo if not running
    if (isPlaying) {
      setIsPlaying(false);
    }
    timelineInfo.current = { playing: false, position: 0 };
  }

  // Zoom
  const zoomClickHandler = useCallback((value) => {
    // Hide and reset the position of the mouse tracker, which
    // prevents the zoom container from overflowing after a zoom change
    if (mouseTracker.current) {
      mouseTracker.current.style = 'left:0px;visibility:hidden';
    }
    onChange({ zoom: value });
  }, [onChange, timeline, mouseTracker.current]);
  const zoomVertClickHandler = useCallback((value) => {
    onChange({ zoomVert: value });
  }, [onChange, timeline]);

  // Recorded triggers
  const recordTriggersClickHandler = useCallback(() => {
    onChange({ recording: !recording });
  }, [onChange, timeline]);
  const configureRecordedTriggersClickHandler = useCallback(() => {
    recordedTriggersDialog.show(DIALOG_CONFIGURE, { triggers: recordedTriggers });
  }, [recordedTriggersDialog, timeline]);
  const recordedTriggersDialogSuccessHandler = useCallback(() => {
    onChange({ recordedTriggers: recordedTriggersDialog.value.triggers });
    recordedTriggersDialog.hide();
  }, [onChange, timeline, recordedTriggersDialog]);
  const recordedTriggersHotkeyHandler = useCallback((e) => {
    if (isRunning && recording && focusIsGlobal()) {
      const { key } = e;
      const newTriggers = [];
      recordedTriggers.forEach(({ hotkey, name, layer, color }) => {
        if (hotkey === key) {
          newTriggers.push({
            name,
            layer,
            color,
            inTime: timelineInfo.current.position,
            id: uniqid(),
            type: ITEM_TRIGGER,
          });
        }
      });
      if (newTriggers.length) {
        onChange({ items: doAddItems(items, newTriggers) });
      }
    }
  }, [onChange, timeline, isRunning, recording, timelineInfo]);
  useHotkeys('*', recordedTriggersHotkeyHandler);

  // Scripts
  const addScriptClickHandler = useCallback((initial = null) => {
    initial ? scriptDialog.show(DIALOG_ADD, initial) : scriptDialog.show();
  }, [scriptDialog]);
  const editScriptClickHandler = useCallback((id) => {
    const script = getItem(items, id);
    scriptDialog.show(DIALOG_EDIT, script);
  }, [scriptDialog, timeline]);
  const deleteScriptClickHandler = useCallback((id) => {
    const script = getItem(items, id);
    deleteWarning(`Are you sure you want to delete script ${getScriptName(script, scriptsNames)}?`, (result) => {
      if (result) {
        onChange({ items: doDeleteItem(items, id) });
      }
    });
  }, [onChange, timeline, scriptsNames]);
  const scriptDialogSuccessHandler = useCallback(() => {
    if (scriptDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, scriptDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...scriptDialog.value, id: uniqid(), type: ITEM_SCRIPT }) });
    }
    scriptDialog.hide();
  }, [onChange, scriptDialog]);

  // Triggers
  const addTriggerClickHandler = useCallback((initial = null) => {
    initial ? triggerDialog.show(DIALOG_ADD, initial) : triggerDialog.show();
  }, [triggerDialog]);
  const editTriggerClickHandler = useCallback((id) => {
    const trigger = getItem(items, id);
    triggerDialog.show(DIALOG_EDIT, trigger);
  }, [triggerDialog, timeline]);
  const deleteTriggerClickHandler = useCallback((id) => {
    const trigger = getItem(items, id);
    deleteWarning(`Are you sure you want to delete trigger ${trigger.name}?`, (result) => {
      if (result) {
        onChange({ items: doDeleteItem(items, id) });
      }
    });
  }, [onChange, timeline]);
  const triggerDialogSuccessHandler = useCallback(() => {
    if (triggerDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, triggerDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...triggerDialog.value, id: uniqid(), type: ITEM_TRIGGER }) });
    }
    triggerDialog.hide();
  }, [onChange, triggerDialog]);

  // Medias
  const addMediaClickHandler = useCallback((initial = null) => {
    initial ? mediaDialog.show(DIALOG_ADD, initial) : mediaDialog.show();
  }, [mediaDialog]);
  const editMediaClickHandler = useCallback((id) => {
    const media = getItem(items, id);
    mediaDialog.show(DIALOG_EDIT, media);
  }, [mediaDialog, timeline]);
  const deleteMediaClickHandler = useCallback((id) => {
    const media = getItem(items, id);
    deleteWarning(`Are you sure you want to delete media ${mediasNames[media.media].name}?`, (result) => {
      if (result) {
        onChange({ items: doDeleteItem(items, id) });
      }
    });
  }, [onChange, timeline, mediasNames]);
  const mediaDialogSuccessHandler = useCallback(() => {
    if (mediaDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, mediaDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...mediaDialog.value, id: uniqid(), type: ITEM_MEDIA }) });
    }
    mediaDialog.hide();
  }, [onChange, mediaDialog]);

  // Curves
  const addCurveClickHandler = useCallback((initial = null) => {
    initial ? curveDialog.show(DIALOG_ADD, initial) : curveDialog.show();
  }, [curveDialog]);
  const editCurveClickHandler = useCallback((id) => {
    const curve = getItem(items, id);
    curveDialog.show(DIALOG_EDIT, curve);
  }, [curveDialog, timeline]);
  const deleteCurveClickHandler = useCallback((id) => {
    const curve = getItem(items, id);
    deleteWarning(`Are you sure you want to delete curve ${curve.name}?`, (result) => {
      if (result) {
        onChange({ items: doDeleteItem(items, id) });
      }
    });
  }, [onChange, timeline]);
  const curveDialogSuccessHandler = useCallback(() => {
    if (curveDialog.mode === DIALOG_EDIT) {
      onChange({ items: doUpdateItem(items, curveDialog.value) });
    } else {
      onChange({ items: doAddItem(items, { ...curveDialog.value, id: uniqid(), type: ITEM_CURVE }) });
    }
    curveDialog.hide();
  }, [onChange, curveDialog]);

  // Items
  const dragContent = useRef(null);
  const itemDragStartHandler = useCallback((e, id, element, mode) => {
    // Ignore when related to onContextMenu
    if (e.button !== 0) {
      return;
    }

    e.stopPropagation();

    element.classList.add('active');
    document.body.style = mode === 'inOutTime' ? 'cursor:ew-resize;' : 'cursor:col-resize;';
    dragContent.current = {
      changed: false,
      startPercent: timelinePercent.current,
      item: getItem(items, id),
      mode,
      element,
    };
  }, [dragContent, items, timelinePercent]);
  const itemChangeLayerUpClick = useCallback((id) => {
    onChange({ items: doChangeItemLayer(items, layers, id, 1) });
  }, [onChange, items, layers]);
  const itemChangeLayerDownClick = useCallback((id) => {
    onChange({ items: doChangeItemLayer(items, layers, id, -1) });
  }, [onChange, items, layers]);
  const itemCopyClick = useCallback((id) => {
    doCopy(items, id, 'item');
  }, [items]);
  const itemCopyInTimeClick = useCallback((id) => {
    doCopy(items, id, 'inTime');
  }, [items]);
  const itemCopyOutTimeClick = useCallback((id) => {
    doCopy(items, id, 'outTime');
  }, [items]);
  const itemCopyInAndOutTimeClick = useCallback((id) => {
    doCopy(items, id, 'inAndOutTime');
  }, [items]);
  const itemPasteClick = useCallback((id, inTime) => {
    onChange({ items: doPaste(items, null, 'item', id, inTime, duration) });
  }, [onChange, items, duration]);
  const itemPasteInTimeClick = useCallback((id) => {
    onChange({ items: doPaste(items, id, 'inTime') });
  }, [onChange, items]);
  const itemPasteOutTimeClick = useCallback((id) => {
    onChange({ items: doPaste(items, id, 'outTime') });
  }, [onChange, items]);
  const itemPasteInAndOutTimeClick = useCallback((id) => {
    onChange({ items: doPaste(items, id, 'inAndOutTime') });
  }, [onChange, items]);
  const itemContextMenuHandler = useCallback((e, id) => {
    e.stopPropagation();

    const item = getItem(items, id);

    const template = [
      {
        label: 'Copy',
        submenu: [
          {
            label: 'Item',
            click: () => itemCopyClick(id),
          },
          ...(item.type === ITEM_TRIGGER ? [
            {
              label: 'Trigger time',
              click: () => itemCopyInTimeClick(id),
            },
          ] : [
              {
                label: 'Block In time',
                click: () => itemCopyInTimeClick(id),
              },
              {
                label: 'Block Out time',
                click: () => itemCopyOutTimeClick(id),
              },
              {
                label: 'Block In and Out time',
                click: () => itemCopyInAndOutTimeClick(id),
              },
            ]
          ),
        ],
      },
      {
        label: 'Paste',
        submenu: item.type === ITEM_TRIGGER ? [
          {
            label: 'Time as trigger time',
            click: () => itemPasteInTimeClick(id),
            enabled: canPasteItem('inTime'),
          },
        ] : [
            {
              label: 'Time as block In time',
              click: () => itemPasteInTimeClick(id),
              enabled: canPasteItem('inTime'),
            },
            {
              label: 'Time as block Out time',
              click: () => itemPasteOutTimeClick(id),
              enabled: canPasteItem('outTime'),
            },
            {
              label: 'In and Out Time as block In and Out time',
              click: () => itemPasteInAndOutTimeClick(id),
              enabled: canPasteItem('inAndOutTime'),
            },
          ],
      },
      {
        label: 'Move item',
        submenu: [
          {
            label: 'To layer above',
            click: () => itemChangeLayerUpClick(id),
            enabled: canChangeItemLayerUp(items, layers, id),
          },
          {
            label: 'To layer below',
            click: () => itemChangeLayerDownClick(id),
            enabled: canChangeItemLayerDown(items, layers, id),
          },
        ],
      },
      {
        type: 'separator',
      },
    ];
    if (item.type === ITEM_SCRIPT) {
      template.push({
        label: 'Edit script block...',
        click: () => editScriptClickHandler(id),
      });
      template.push({ type: 'separator' });
      template.push({
        label: 'Delete script block...',
        click: () => deleteScriptClickHandler(id),
      });
    }
    if (item.type === ITEM_TRIGGER) {
      template.push({
        label: 'Edit trigger...',
        click: () => editTriggerClickHandler(id),
      });
      template.push({ type: 'separator' });
      template.push({
        label: 'Delete trigger...',
        click: () => deleteTriggerClickHandler(id),
      });
    }
    if (item.type === ITEM_CURVE) {
      template.push({
        label: 'Edit curve block...',
        click: () => editCurveClickHandler(id),
      });
      template.push({ type: 'separator' });
      template.push({
        label: 'Delete curve block...',
        click: () => deleteCurveClickHandler(id),
      });
    }
    if (item.type === ITEM_MEDIA) {
      template.push({
        label: 'Edit media block...',
        click: () => editMediaClickHandler(id),
      });
      template.push({ type: 'separator' });
      template.push({
        label: 'Delete media block...',
        click: () => deleteMediaClickHandler(id),
      });
    }

    const menu = remote.Menu.buildFromTemplate(template);
    menu.popup();
  }, [
    items,
    layers,
    editScriptClickHandler,
    deleteScriptClickHandler,
    editTriggerClickHandler,
    deleteTriggerClickHandler,
    editMediaClickHandler,
    deleteMediaClickHandler,
    editCurveClickHandler,
    deleteCurveClickHandler,
    itemChangeLayerUpClick,
    itemChangeLayerDownClick,
    itemCopyClick,
    itemCopyInTimeClick,
    itemCopyOutTimeClick,
    itemCopyInAndOutTimeClick,
    itemPasteClick,
    itemPasteInTimeClick,
    itemPasteOutTimeClick,
    itemPasteInAndOutTimeClick,
    timelinePercent,
  ]);
  const itemChangeHandler = useCallback((value, id) => {
    onChange({ items: doUpdateItem(items, value) })
  }, [onChange, items])

  // Zoom container & trackers
  const zoomContainerMouseMoveHandler = useCallback((e) => {
    if (mouseTracker.current) {
      mouseTracker.current.style = `left:${getContainerX(e)}px;visibility:visible`;
    }
    const percent = getContainerPercent(e);
    timelinePercent.current = percent;
    if (dragContent.current) {
      const { mode, element, item, startPercent } = dragContent.current;

      let effectivePercent;

      if (mode === 'inTime') {
        if (item.type === ITEM_TRIGGER) {
          effectivePercent = percent;
          element.style = `left:${percentString(effectivePercent)}`;
        } else {
          effectivePercent = Math.min(percent, (item.outTime / duration));
          element.style = `left:${percentString(effectivePercent)};width:${percentString((item.outTime / duration) - effectivePercent)}`;
        }
      } else if (mode === 'outTime') {
        effectivePercent = Math.max((item.inTime / duration), percent);
        element.style = `left:${percentString(item.inTime / duration)};width:${percentString(effectivePercent - (item.inTime / duration))}`;
      } else if (mode === 'inOutTime') {
        effectivePercent = Math.max(0, Math.min(1 - ((item.outTime - item.inTime) / duration), percent - (startPercent - (item.inTime / duration))));
        element.style = `left:${percentString(effectivePercent)};width:${percentString((item.outTime - item.inTime) / duration)}`;
      }

      dragContent.current.percent = effectivePercent;
      dragContent.current.changed = true;
    }
  }, [mouseTracker.current, dragContent.current, timelinePercent, duration]);
  const zoomContainerDoubleClickHandler = useCallback((e) => {
    if (isRunning) {
      const { current } = timelineInfo;
      const data = {
        ...current,
        position: Math.round(timelinePercent.current * duration),
      };
      ipcRendererSend(UPDATE_TIMELINE_INFO, data);
    }
  }, [isRunning, timelinePercent, timelineInfo, duration]);
  const windowMouseUpHandler = useCallback((e) => {
    if (dragContent.current) {
      const { mode, element, item, percent, changed } = dragContent.current;

      if (changed) {
        if (mode === 'inTime') {
          onChange({ items: doUpdateItem(items, { ...item, inTime: Math.round(duration * percent) }) });
        } else if (mode === 'outTime') {
          onChange({ items: doUpdateItem(items, { ...item, outTime: Math.round(duration * percent) }) });
        } else if (mode === 'inOutTime') {
          onChange({ items: doUpdateItem(items, { ...item, inTime: Math.round(duration * percent), outTime: Math.round((duration * percent) + (item.outTime - item.inTime)) }) });
        }
      }

      element.classList.remove('active');
      document.body.style = 'cursor:initial;';
      dragContent.current = null;
    }
  }, [dragContent.current, items, duration, onChange]);
  const updateTimelineInfoHandler = useCallback((e, data) => {
    if (isRunning) {
      timelineInfo.current = data;
      if (positionTracker.current) {
        const { position } = data;
        const percent = position / duration;
        positionTracker.current.style = `left:${percentString(percent)}`;
      }
      if (!isPlaying && data.playing) {
        setIsPlaying(true);
      } else if (isPlaying && !data.playing) {
        setIsPlaying(false);
      }
    }
  }, [positionTracker.current, timelineInfo, duration, isRunning, isPlaying]);
  useEffect(() => {
    window.addEventListener('mouseup', windowMouseUpHandler);
    return () => window.removeEventListener('mouseup', windowMouseUpHandler);
  }, [windowMouseUpHandler]);
  useEffect(() => {
    ipcRendererListen(UPDATE_TIMELINE_INFO, updateTimelineInfoHandler);
    return () => ipcRendererClear(UPDATE_TIMELINE_INFO, updateTimelineInfoHandler);
  }, [updateTimelineInfoHandler]);

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
    deleteWarning(`Are you sure you want to delete layer ${layer.order + 1}?`, (result) => {
      if (result) {
        onChange({ layers: doDeleteLayer(layers, id), items: doDeleteItemsOfLayer(items, id) });
      }
    });;
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
        onItemChange={itemChangeHandler}
      />
    );
  }, [timeline, itemsByLayer, scriptsNames, itemDragStartHandler, itemContextMenuHandler, itemChangeHandler]);
  const layerContextMenuRenderer = useCallback((template, e, id) => {
    const inTime = Math.round(timelinePercent.current * duration);
    const outTime = Math.min(inTime + 10000, duration);
    template[0].submenu.unshift({
      type: 'separator',
    });
    template[0].submenu.unshift({
      label: 'Media block here...',
      click: () => addMediaClickHandler({ layer: id, inTime, outTime })
    });
    template[0].submenu.unshift({
      label: 'Curve block here...',
      click: () => addCurveClickHandler({ layer: id, inTime, outTime })
    });
    template[0].submenu.unshift({
      label: 'Trigger here...',
      click: () => addTriggerClickHandler({ layer: id, inTime })
    });
    template[0].submenu.unshift({
      label: 'Script block here...',
      click: () => addScriptClickHandler({ layer: id, inTime, outTime })
    });
    template.splice(1, 0, ...[
      {
        label: 'Paste',
        submenu: [
          {
            label: 'Item here',
            enabled: canPasteItem('item'),
            click: () => itemPasteClick(id, inTime),
          },
        ],
      },
    ]);
    return template;
  }, [
    duration,
    timelinePercent,
    addScriptClickHandler,
    addTriggerClickHandler,
    addCurveClickHandler,
    addMediaClickHandler,
  ]);

  // Control
  const playPauseHandler = useCallback((e) => {
    if (isRunning && ((e instanceof KeyboardEvent && focusIsGlobal()) || !(e instanceof KeyboardEvent))) {
      const { current } = timelineInfo;
      const data = {
        ...current,
        playing: current ? !current.playing : true,
      };
      ipcRendererSend(UPDATE_TIMELINE_INFO, data);
    }
  }, [isRunning, timelineInfo]);
  const rewindHandler = useCallback((e) => {
    if (isRunning && ((e instanceof KeyboardEvent && focusIsGlobal()) || !(e instanceof KeyboardEvent))) {
      const { current } = timelineInfo;
      const data = {
        ...current,
        position: 0,
      };
      ipcRendererSend(UPDATE_TIMELINE_INFO, data);
    }
  }, [isRunning, timelineInfo]);
  const backHandler = useCallback(() => {
    if (isRunning && focusIsGlobal()) {
      const { current } = timelineInfo;
      const data = {
        ...current,
        position: current ? Math.max(current.position - 5000, 0) : 0,
      };
      ipcRendererSend(UPDATE_TIMELINE_INFO, data);
    }
  }, [isRunning, timelineInfo]);
  const forwardHandler = useCallback(() => {
    if (isRunning && focusIsGlobal()) {
      const { current } = timelineInfo;
      const data = {
        ...current,
        position: current ? Math.min(current.position + 5000, duration) : 5000,
      };
      ipcRendererSend(UPDATE_TIMELINE_INFO, data);
    }
  }, [isRunning, timelineInfo, duration]);
  useHotkeys(' ', playPauseHandler);
  useHotkeys('r', rewindHandler);
  useHotkeys('Shift+ArrowLeft', backHandler);
  useHotkeys('Shift+ArrowRight', forwardHandler);

  return (
    <>
      <StyledContainer>
        <StyledTopRow>
          <StyledButtonGroup>
            <Button
              small
              icon="step-backward"
              disabled={!isRunning}
              onClick={rewindHandler}
            />
            <Button
              small
              icon={isPlaying ? 'pause' : 'play'}
              disabled={!isRunning}
              onClick={playPauseHandler}
            />
          </StyledButtonGroup>
          <StyledButtonGroup>
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  {hasLayers ? (
                    <>
                      <Menu.Item
                        icon={ICON_SCRIPT}
                        text="Add Script block..."
                        onClick={() => addScriptClickHandler()}
                      />
                      <Menu.Item
                        icon={ICON_TRIGGER}
                        text="Add Trigger..."
                        onClick={() => addTriggerClickHandler()}
                      />
                      <Menu.Item
                        icon={ICON_CURVE}
                        text="Add Curve block..."
                        onClick={() => addCurveClickHandler()}
                      />
                      <Menu.Item
                        icon={ICON_MEDIA}
                        text="Add Media block..."
                        onClick={() => addMediaClickHandler()}
                      />
                      <Menu.Divider />
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
            <Button
              small
              icon="record"
              disabled={!hasLayers}
              intent={recording ? Intent.DANGER : undefined}
              onClick={recordTriggersClickHandler}
            />
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  <Menu.Item
                    icon="settings"
                    text="Configure recorded triggers..."
                    onClick={configureRecordedTriggersClickHandler}
                  />
                </Menu>
              )}
            >
              <Button
                small
                icon="caret-down"
                disabled={!hasLayers}
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
            onDoubleClick={zoomContainerDoubleClickHandler}
          >
            <LayerEditor
              layers={layers}
              renderLayerChildren={layerChildrenRenderer}
              renderLayerContextMenu={layerContextMenuRenderer}
              onChange={layersChangerHandler}
              onDelete={layersDeleteHandler}
            />
            {isRunning && (
              <StyledPositionTracker
                ref={positionTracker}
              />
            )}
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
        duration={duration}
      />
      <TimelineTriggerDialog
        opened={triggerDialog.opened}
        mode={triggerDialog.mode}
        value={triggerDialog.value}
        onChange={triggerDialog.change}
        onSuccess={triggerDialogSuccessHandler}
        onClose={triggerDialog.hide}
        layers={availableLayers}
        duration={duration}
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
        duration={duration}
      />
      <TimelineCurveDialog
        opened={curveDialog.opened}
        mode={curveDialog.mode}
        value={curveDialog.value}
        onChange={curveDialog.change}
        onSuccess={curveDialogSuccessHandler}
        onClose={curveDialog.hide}
        layers={availableLayers}
        duration={duration}
      />
      <TimelineRecordedTriggersDialog
        opened={recordedTriggersDialog.opened}
        mode={recordedTriggersDialog.mode}
        value={recordedTriggersDialog.value}
        onChange={recordedTriggersDialog.change}
        onSuccess={recordedTriggersDialogSuccessHandler}
        onClose={recordedTriggersDialog.hide}
        layers={availableLayers}
      />
    </>
  )
}
