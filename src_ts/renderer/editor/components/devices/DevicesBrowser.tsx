import React, { MouseEvent, useCallback } from 'react';
import { Intent, Button, Icon, Tag } from '@blueprintjs/core';

import { showDeviceDialogAction } from '../../store/actions/dialogs';
import { deleteDeviceAction, runDeviceAction, stopDeviceAction } from '../../store/actions/devices';
import ItemBrowser from '../ui/ItemBrowser';
import TagGroup from '../ui/TagGroup';
import contentRunning from '../../store/selectors/contentRunning';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { DeviceId } from '../../../../common/types';
import { KodtrolDialogType } from '../../constants';
import { ok } from 'assert';
import { IOType } from '../../../../common/constants';

const itemPropsFilter = ({ id, name, type, tags }) => ({ id, name, type, tags });

const DeviceLabel = ({ item: { name, id }, activeItemId }) => {
  return (
    <>
      {name}
      {id === activeItemId && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  );
}

const DeviceSecondaryLabel = ({ item: { id, tags, type }, activeItemId }) => {
  const dispatch = useKodtrolDispatch();
  const runHandler = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    dispatch(runDeviceAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    dispatch(stopDeviceAction());
  }, [dispatch]);
  const doubleClickHandler = useCallback((e: MouseEvent) => {
    // Trap accidental double clicks
    e.stopPropagation();
  }, []);

  return (
    <>
      <TagGroup>
        {tags.map((tag, index) => {
          return (
            <Tag
              minimal
              key={index}
            >
              {tag}
            </Tag>
          );
        })}
      </TagGroup>
      {(type === IOType.DMX || type === IOType.ARTNET) ? (
        id !== activeItemId ? (
          <Button
            small
            minimal
            icon="eye-open"
            title="Test device"
            onClick={runHandler}
            onDoubleClick={doubleClickHandler}
          />
        ) : (
          <Button
            small
            minimal
            icon="eye-off"
            intent={Intent.DANGER}
            title="Stop testing device"
            onClick={stopHandler}
            onDoubleClick={doubleClickHandler}
          />
        )
      ) : null
      }
    </>
  );
}

export default function DevicesBrowser() {
  const devices = useKodtrolSelector((state) => state.devices);
  const runDevice = useKodtrolSelector((state) => state.runDevice);
  const isContentRunning = useKodtrolSelector(contentRunning);

  const dispatch = useKodtrolDispatch();
  const editPropsCallback = useCallback((id: DeviceId) => {
    const device = devices.find((device) => device.id === id);
    ok(device, 'device not found');
    dispatch(showDeviceDialogAction(KodtrolDialogType.EDIT, device));
  }, [dispatch, devices]);
  const duplicateCallback = useCallback((id: DeviceId) => {
    const device = devices.find((device) => device.id === id);
    ok(device, 'device not found');
    dispatch(showDeviceDialogAction(KodtrolDialogType.DUPLICATE, device));
  }, [dispatch, devices]);
  const deleteCallback = useCallback((id: DeviceId) => {
    dispatch(deleteDeviceAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="device"
      items={devices}
      activeItemId={runDevice}
      editPropsCallback={editPropsCallback}
      duplicateCallback={duplicateCallback}
      deleteCallback={deleteCallback}
      itemLabelComponent={DeviceLabel}
      itemSecondaryLabelComponent={DeviceSecondaryLabel}
      itemPropsFilter={itemPropsFilter}
      enableDelete={!isContentRunning}
    />
  );
};
