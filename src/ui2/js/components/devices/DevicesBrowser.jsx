import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Intent, Button, Icon, Tag } from '@blueprintjs/core';

import { showDeviceDialogAction } from '../../../../common/js/store/actions/dialogs';
import { deleteDeviceAction, runDeviceAction, stopDeviceAction } from '../../../../common/js/store/actions/devices';
import { DIALOG_EDIT, DIALOG_DUPLICATE } from '../../../../common/js/constants/dialogs';
import ItemBrowser from '../ui/ItemBrowser';
import TagGroup from '../ui/TagGroup';
import { IO_DMX, IO_ARTNET } from '../../../../common/js/constants/io';
import contentRunning from '../../../../common/js/store/selectors/contentRunning';

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
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runDeviceAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopDeviceAction());
  }, [dispatch]);
  const doubleClickHandler = useCallback((e) => {
    e.stopPropagation();
  });

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
      {(type === IO_DMX || type === IO_ARTNET) ? (
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
  const devices = useSelector((state) => state.devices);
  const devicesFolders = useSelector((state) => state.devicesFolders);
  const runDevice = useSelector((state) => state.runDevice);
  const isContentRunning = useSelector(contentRunning);

  const dispatch = useDispatch();
  const editPropsCallback = useCallback((id) => {
    const device = devices.find((device) => device.id === id);
    dispatch(showDeviceDialogAction(DIALOG_EDIT, device));
  }, [dispatch, devices]);
  const duplicateCallback = useCallback((id) => {
    const device = devices.find((device) => device.id === id);
    dispatch(showDeviceDialogAction(DIALOG_DUPLICATE, device));
  }, [dispatch, devices]);
  const deleteCallback = useCallback((id) => {
    dispatch(deleteDeviceAction(id));
  }, [dispatch]);

  return (
    <ItemBrowser
      label="device"
      items={devices}
      folders={devicesFolders}
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
}
