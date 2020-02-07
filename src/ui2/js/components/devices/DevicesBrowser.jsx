import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Intent, Button, Icon, Tag } from '@blueprintjs/core';

import { showDeviceDialogAction } from '../../../../common/js/store/actions/dialogs';
import { deleteDeviceAction, runDeviceAction, stopDeviceAction } from '../../../../common/js/store/actions/devices';
import { DIALOG_EDIT } from '../../../../common/js/constants/dialogs';
import ItemBrowser from '../ui/ItemBrowser';
import TagGroup from '../ui/TagGroup';

const DeviceLabel = ({ name, id, activeItemId }) => {
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

const DeviceSecondaryLabel = ({ id, tags, activeItemId }) => {
  const dispatch = useDispatch();
  const runHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(runDeviceAction(id));
  }, [dispatch, id]);
  const stopHandler = useCallback((e) => {
    e.stopPropagation();
    dispatch(stopDeviceAction());
  }, [dispatch]);

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
      {id !== activeItemId ? (
        <Button
          small
          minimal
          icon="eye-open"
          onClick={runHandler}
        />
      ) : (
          <Button
            small
            minimal
            icon="eye-off"
            intent={Intent.DANGER}
            onClick={stopHandler}
          />
        )}
    </>
  );
}

export default function DevicesBrowser() {
  const devices = useSelector((state) => state.devices);
  const devicesFolders = useSelector((state) => state.devicesFolders);
  const runDevice = useSelector((state) => state.runDevice);

  const dispatch = useDispatch();
  const editPropsCallback = useCallback((id) => {
    const device = devices.find((device) => device.id === id);
    dispatch(showDeviceDialogAction(DIALOG_EDIT, device));
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
      deleteCallback={deleteCallback}
      itemLabelComponent={DeviceLabel}
      itemSecondaryLabelComponent={DeviceSecondaryLabel}
      extraComponentProp="tags"
    />
  );
}
