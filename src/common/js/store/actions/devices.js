import uniqid from 'uniqid';

import hash from '../../lib/hash';

export const updateDevices = (devices) => ({
  type: 'UPDATE_DEVICES',
  payload: devices,
});

export const createDevice = (deviceData) => ({
  type: 'CREATE_DEVICE',
  payload: {
    ...deviceData,
    id: uniqid(),
    hash: hash(deviceData),
  },
});

export const deleteDevice = (id) => ({
  type: 'DELETE_DEVICE',
  payload: id,
});

export const saveDevice = (id, data) => ({
  type: 'SAVE_DEVICE',
  payload: {
    id,
    data: {
      ...data,
      hash: hash(data),
    },
  },
});