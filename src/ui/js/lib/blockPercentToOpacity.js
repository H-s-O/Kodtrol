export default (percent) => {
  if (percent < 0) {
    return percent + 1;
  } else if (percent > 1) {
    return 1 - (percent - 1);
  } else {
    return percent;
  }
};

