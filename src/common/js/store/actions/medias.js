import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const updateMedias = (medias) => {
  return {
    type: 'UPDATE_MEDIAS',
    payload: medias,
  };
};

export const createMedia = (data) => {
  const newData = {
    ...data,
    id: uniqid(),
  }
  return {
    type: 'CREATE_MEDIA',
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const deleteMedia = (id) => {
  return {
    type: 'DELETE_MEDIA',
    payload: id,
  };
};

export const saveMedia = (id, data) => {
  return {
    type: 'SAVE_MEDIA',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};