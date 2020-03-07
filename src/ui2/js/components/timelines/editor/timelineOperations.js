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

export const getTimelineScreenXFromEvent = (e, parent) => {
  const { clientX } = e;
  const { left } = parent.getBoundingClientRect();
  const { scrollLeft } = parent;

  const pos = (clientX - left + scrollLeft);
  return pos;
}

export const getTimelinePercentFromEvent = (e, parent) => {
  const { clientX } = e;
  const { left } = parent.getBoundingClientRect();
  const { scrollLeft, scrollWidth } = parent;

  const percent = (clientX - left + scrollLeft) / scrollWidth;
  return percent;
}
