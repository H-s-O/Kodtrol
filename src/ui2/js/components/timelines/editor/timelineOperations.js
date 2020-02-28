export const getItem = (items, itemId) => {
  const item = items.find(({ id }) => id === itemId);
  return item;
}

export const doAddItem = (items, item) => {
  const newItems = [...items, item];
  return newItems;
};

export const doUpdateItem = (items, item) => {
  const newItems = items.map((obj) => obj.id === item.id ? item : obj);
  return newItems;
}
