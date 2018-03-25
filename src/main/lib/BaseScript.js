module.exports = class BaseScript {
  // "Macros"
  _clamp(value, min, max) {
    return (value < min ? min : value > max ? max : value);
  }
  _map(value, valueMin, valueMax, outMin, outMax) {
    return (outMin + (((value - valueMin) / (valueMax - valueMin) * (outMax - outMin))));
  }
  _randomBetween(min, max) {
    return (min + (Math.random() * (max - min)));
  }
  _randomIndex(arr) {
    return (Math.floor(Math.random() * arr.length));
  }
  _isBeatDivision(beat, division) {
    return (beat > 0 && beat % division === 0);
  }
};
