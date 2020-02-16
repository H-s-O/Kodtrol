export default function rgbMix(color1, color2, percent = 0.5) {
  if (!color1 || !color2) {
    return null;
  }
  return {
    r: Math.round(color1.r + ((color2.r - color1.r) * percent)),
    g: Math.round(color1.g + ((color2.g - color1.g) * percent)),
    b: Math.round(color1.b + ((color2.b - color1.b) * percent)),
  }
};
