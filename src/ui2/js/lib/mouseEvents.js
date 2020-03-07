export const getContainerX = (e) => {
  const bounds = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  return x;
};

export const getContainerPercent = (e, clamp = true) => {
  const bounds = (e.currentTarget || e.target).getBoundingClientRect();
  const percent = (e.clientX - bounds.left) / bounds.width;
  if (clamp) {
    return percent < 0 ? 0 : percent > 1 ? 1 : percent;
  }
  return percent;
};
