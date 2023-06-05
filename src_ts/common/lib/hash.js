import objectHash from 'object-hash';

const excluder = (exclusions, key, depth) => {
  if (!(key in exclusions)) {
    return false;
  }
  if (exclusions[key] === true) {
    return true;
  }
  return exclusions[key] === depth;
}

export const hashDataObject = (value, exclude = []) => {
  const exclusions = [...exclude, 'hash'].reduce((obj, key) => {
    if (key.indexOf(':') !== -1) {
      const [cleanKey, depth] = key.split(':')
      return { ...obj, [cleanKey]: parseInt(depth) };
    }
    return { ...obj, [key]: true };
  }, {});
  const newHash = objectHash(value, {
    algorithm: 'md5',
    ignoreUnknown: true,
    respectType: false,
    unorderedArrays: true,
    excludeKeys: (key, depth) => excluder(exclusions, key, depth),
  });
  return newHash;
};
