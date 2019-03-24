import objectHash from 'object-hash';

export const hashDataObject = (value) => {
  const newHash = objectHash(value, {
    algorithm: 'md5',
    ignoreUnknown: true,
    respectType: false,
    unorderedArrays: true,
    excludeKeys: (key) => key === 'hash',
  });
  return newHash;
};
