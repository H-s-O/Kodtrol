import objectHash from 'object-hash';

type Exclusions = {
  [k: string]: boolean | number
};

const excluder = (exclusions: Exclusions, key: string, depth: number): boolean => {
  if (!(key in exclusions)) {
    return false;
  }
  if (exclusions[key] === true) {
    return true;
  }
  return exclusions[key] === depth;
};

export const hashDataObject = (value: object, exclude: readonly string[] = []): string => {
  const exclusions = [...exclude, 'hash'].reduce((obj, key) => {
    if (key.indexOf(':') !== -1) {
      const [cleanKey, depth] = key.split(':')
      return { ...obj, [cleanKey]: parseInt(depth) };
    }
    return { ...obj, [key]: true };
  }, {} as Exclusions);
  const newHash = objectHash(value, {
    algorithm: 'md5',
    ignoreUnknown: true,
    respectType: false,
    unorderedArrays: true,
    //@ts-ignore excludeKeys gets patched by Kodtrol to add "depth"
    excludeKeys: (key: string, depth: number) => excluder(exclusions, key, depth),
  });
  return newHash;
};

type HashComparable = {
  id: string
  hash: string
};

export const hashComparator = <T extends HashComparable>(
  newItems: readonly T[],
  existingItems: { [id: string]: T },
  createCallback: (newItem: T) => T,
  updateCallback: (exitingItem: T, updatedItem: T) => T,
  deleteCallback: (deletedItem: T) => void,
): { [id: string]: T } => {
  const result = newItems.reduce((items, item) => {
    const { id, hash } = item;
    if (id in items) {
      if (items[id].hash !== hash) {
        // update existing & changed
        updateCallback(items[id], item);
        return items;
      }
      return items;
    } else {
      // new
      return {
        ...items,
        [id]: createCallback(item),
      };
    }
  }, existingItems || {});
  const newIds = newItems.map(({ id }) => id);
  for (let id in existingItems) {
    if (newIds.indexOf(id) === -1) {
      // delete removed
      deleteCallback(result[id]);
      delete result[id];
    }
  }
  return result;
};
