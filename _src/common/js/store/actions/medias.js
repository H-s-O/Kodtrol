import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const UPDATE_MEDIAS = 'update_medias';
export const updateMediasAction = (medias) => {
  return {
    type: UPDATE_MEDIAS,
    payload: medias,
  };
};

export const CREATE_MEDIA = 'create_media';
export const createMediaAction = (data) => {
  const newData = {
    ...data,
    id: uniqid(),
  }
  return {
    type: CREATE_MEDIA,
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const CREATE_MEDIAS = 'create_medias';
export const createMediasAction = (list) => {
  const newData = list.map((data) => {
    const newMediaData = {
      ...data,
      id: uniqid(),
    };
    return {
      ...newMediaData,
      hash: hashDataObject(newMediaData, excludeHashProps),
    };
  });
  return {
    type: CREATE_MEDIAS,
    payload: newData,
  };
};

export const DELETE_MEDIA = 'delete_media';
export const deleteMediaAction = (id) => {
  return {
    type: DELETE_MEDIA,
    payload: id,
  };
};

export const SAVE_MEDIA = 'save_media';
export const saveMediaAction = (id, data) => {
  return {
    type: SAVE_MEDIA,
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};
