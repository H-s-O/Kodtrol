import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const updateDevices = (devices) => {
  return {
    type: 'UPDATE_DEVICES',
    payload: devices,
  };
};

export const createDevice = (data) => {
  const newData = {
    ...data,
    id: uniqid(),
  }
  return {
    type: 'CREATE_DEVICE',
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
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
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};