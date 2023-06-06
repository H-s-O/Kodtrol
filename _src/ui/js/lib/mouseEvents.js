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

export const getContainerCoords = (e, clamp = true) => {
  const bounds = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - bounds.left) / bounds.width;
  const y = 1 - ((e.clientY - bounds.top) / bounds.height);
  if (clamp) {
    return {
      x: x < 0 ? 0 : x > 1 ? 1 : x,
      y: y < 0 ? 0 : y > 1 ? 1 : y,
    };
  }
  return { x, y };
};
