export default (newItems, existingItems, createCallback, updateCallback, deleteCallback) => {
  const result = newItems.reduce((items, item) => {
    const { id, hash } = item;
    // update existing & changed
    if ((id in items) && (!('hash' in items[id]) || items[id].hash !== hash)) {
      // console.log('update', id);
      updateCallback(items[id], item);
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
    // delete removed
    if (newIds.indexOf(id) === -1) {
      // console.log('delete', id);
      deleteCallback(result[id]);
      delete result[id];
    }
  }
  return result;
}