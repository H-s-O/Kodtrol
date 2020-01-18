import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Button, Intent, Icon } from '@blueprintjs/core';

import TagGroup from '../ui/TagGroup';
import ManagedTree from '../ui/ManagedTree';
import { showEditDeviceDialogAction } from '../../../../common/js/store/actions/dialogs';
import { runDeviceAction, stopDeviceAction } from '../../../../common/js/store/actions/devices';

const DeviceLabel = ({ name, running }) => {
  return (
    <>
      {name}
      {running && (
        <Icon
          style={{ marginLeft: '3px', display: 'inline-block' }}
          icon="eye-open"
          intent={Intent.SUCCESS}
        />
      )}
    </>
  );
}

const DeviceSecondaryLabel = ({ id, tags, running }) => {
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
      {!running ? (
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
  const nodeDoubleClickHandler = useCallback(({ id, hasCaret }) => {
    if (!hasCaret) {
      const device = devices.find((device) => device.id === id);
      dispatch(showEditDeviceDialogAction(device));
    }
  }, [dispatch, devices]);

  const items = devices.map(({ id, name, tags }) => {
    const running = id === runDevice;
    return {
      id,
      key: id,
      label: (
        <DeviceLabel
          name={name}
          running={running}
        />
      ),
      secondaryLabel: (
        <DeviceSecondaryLabel
          id={id}
          tags={tags}
          running={running}
        />
      ),
    }
  });
  const folders = devicesFolders.map(({ id, name }) => ({
    id,
    key: id,
    label: name,
    hasCaret: true,
    isExpanded: false,
    icon: 'folder-close',
  }));

  return (
    <ManagedTree
      items={items}
      folders={folders}
      onNodeDoubleClick={nodeDoubleClickHandler}
    />
  );
}
