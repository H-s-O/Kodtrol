import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

export const updateDevices = (devices) => {
  return {
    type: 'UPDATE_DEVICES',
    payload: devices,
  };
};

export const createDevice = (data) => {
  const hashableData = {
    ...data,
  }
  return {
    type: 'CREATE_DEVICE',
    payload: {
      ...hashableData,
      id: uniqid(),
      hash: hashDataObject(hashableData),
    },
  };
};

export const deleteDevice = (id) => {
  return {
    type: 'DELETE_DEVICE',
    payload: id,
  };
};

export const saveDevice = (id, data) => {
  return {
    type: 'SAVE_DEVICE',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data),
      },
    },
  };
};