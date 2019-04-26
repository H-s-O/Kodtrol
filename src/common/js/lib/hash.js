import objectHash from 'object-hash';

export const hashDataObject = (value, exclude = []) => {
  const exclusions = [...exclude, 'hash'];
  const newHash = objectHash(value, {
    algorithm: 'md5',
    ignoreUnknown: true,
    respectType: false,
    unorderedArrays: true,
    excludeKeys: (key) => exclusions.indexOf(key) !== -1,
  });
  return newHash;
};
