export default (newItems, existingItems, createCallback, updateCallback, deleteCallback) => {
  const result = newItems.reduce((items, item) => {
    const { id, hash } = item;
    if (id in items) {
      if (items[id].hash !== hash) {
        // update existing & changed
        // console.log('update', id, items[id].hash, hash);
        updateCallback(items[id], item);
        return items;
      }
      return items;
    }
    else {
      // new
      // console.log('create', id);
      return {
        ...items,
        [id]: createCallback(item),
      };
    }
  }, existingItems || {});
  const newIds = newItems.map(({id}) => id);
  for (let id in existingItems) {
    if (newIds.indexOf(id) === -1) {
      // delete removed
      // console.log('delete', id);
      deleteCallback(result[id]);
      delete result[id];
    }
  }
  return result;
}