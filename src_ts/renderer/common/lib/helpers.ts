import { WindowAdditionalArgs } from '../../../common/types';

export const extractAdditionalData = (): WindowAdditionalArgs | null => {
  try {
    const prefix = '--kodtrol=';
    const arg = process.argv.find((val) => val.startsWith(prefix));
    if (!arg) return null;
    const str = arg.substring(prefix.length);
    const json = JSON.parse(str) as WindowAdditionalArgs;
    return json;
  } catch (err) {
    console.error('Error extracting additional data:', err);
    return null;
  }
};

export const focusIsGlobal = (): boolean => {
  return window.document.activeElement === window.document.body;
};

export const getContainerX = (e): number => {
  const bounds = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  return x;
};

export const getContainerPercent = (e, clamp: boolean = true): number => {
  const bounds = (e.currentTarget || e.target).getBoundingClientRect();
  const percent = (e.clientX - bounds.left) / bounds.width;
  if (clamp) {
    return percent < 0 ? 0 : percent > 1 ? 1 : percent;
  }
  return percent;
};

export const getContainerCoords = (e, clamp: boolean = true): { x: number, y: number } => {
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
