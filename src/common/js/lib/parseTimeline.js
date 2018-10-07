export default (items) => {
  items.reduce((list, item) => {
    const { layer } = item;
    if (!list[layer]) {
      list[layer] = [];
    }
    list[layer].push(item);
    return list;
  }, []);
};