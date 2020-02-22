import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { ButtonGroup, Button, Popover, Menu, Position, Icon } from '@blueprintjs/core';

import LayerEditor from '../../layer_editor/LayerEditor';
import { ICON_SCRIPT, ICON_MEDIA, ICON_CURVE, ICON_TRIGGER, ICON_LAYER } from '../../../../../common/js/constants/icons';
import percentString from '../../../lib/percentString';
import { doAddLayer, doDeleteLayer } from '../../layer_editor/layerOperations';
import { deleteWarning } from '../../../lib/dialogHelpers';
import TimelineScriptDialog from './TimelineScriptDialog';
import { DIALOG_ADD } from '../../../../../common/js/constants/dialogs';

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

const ZOOM_LEVELS = [1.0, 2.0, 3.0, 5.0, 8.0, 10.0];

export default function TimelineEditor({ timeline, onChange }) {
  const { layers, items, zoom, zoomVert } = timeline;

  const [scriptDialog, setScriptDialog] = useState({ opened: false, mode: null, value: null });
  const [mediaDialog, setMediaDialog] = useState({ opened: false, mode: null, value: null });
  const [curveDialog, setCurveDialog] = useState({ opened: false, mode: null, value: null });
  const [triggerDialog, setTriggerDialog] = useState({ opened: false, mode: null, value: null });

  const zoomClickHandler = useCallback((value) => {
    onChange({ zoom: value });
  }, [onChange, timeline]);
  const zoomVertClickHandler = useCallback((value) => {
    onChange({ zoomVert: value });
  }, [onChange, timeline]);
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
  const addScriptClickHandler = useCallback(() => {
    setScriptDialog({ opened: true, mode: DIALOG_ADD, value: {} });
  });

  const availableLayers = useMemo(() => {
    return layers.map(({ id, order }) => ({ id, name: order + 1 }));
  }, [timeline]);

  return (
    <>
      <StyledContainer>
        <StyledTopRow>
          <StyledButtonGroup>
            <Button
              small
              icon="step-backward"
            />
            <Button
              small
              icon="play"
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
                    icon={ICON_CURVE}
                    text="Add Curve block"
                  />
                  <Menu.Item
                    icon={ICON_MEDIA}
                    text="Add Media block"
                  />
                  <Menu.Item
                    icon={ICON_TRIGGER}
                    text="Add Trigger"
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
        layers={availableLayers}
      />
    </>
  )
}
