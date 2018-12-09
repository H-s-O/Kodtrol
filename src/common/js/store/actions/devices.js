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

export const updateDevice = (deviceData) => ({
  type: 'UPDATE_DEVICE',
  payload: {
    ...deviceData,
    lastUpdated: Date.now(),
  },
});

export const deleteDevice = (id) => ({
  type: 'DELETE_DEVICE',
  payload: id,
});