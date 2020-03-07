import { basename } from 'path';

export const getMediaName = ({ name, file }) => {
  return name || basename(file) || '[no name]';
};
