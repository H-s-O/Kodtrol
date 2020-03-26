const obj = {
  mode: null,
  value: null,
};

export const clipboardPut = (mode, value) => {
  obj.mode = mode;
  obj.value = value;
};

export const clipboardGetMode = () => obj.mode;

export const clipboardGetValue = () => obj.value;
