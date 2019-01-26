import uniqid from 'uniqid';

export const updateDevices = (devices) => ({
  type: 'UPDATE_DEVICES',
  payload: devices,
});

export const createDevice = (deviceData) => ({
  type: 'CREATE_DEVICE',
  payload: {
    ...deviceData,
    id: uniqid(),
    lastUpdated: Date.now(),
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
      lastUpdated: Date.now(),
    },
  },
});