const eases = require('eases');

export default {
  // "Macros"
  _isEven(value) {
    return value % 2 === 0;
  },
  _isOdd(value) {
    return value % 2 !== 0;
  },
  _clamp(value, min, max) {
    return (value < min ? min : value > max ? max : value);
  },
  _map(value, valueMin, valueMax, outMin, outMax) {
    return (outMin + (((value - valueMin) / (valueMax - valueMin) * (outMax - outMin))));
  },
  _mix(a, b, percent = 0.5, type = 'linear') {
    return a + ((b - a) * percent);
  },
  _tri(x) {
    return (2 / Math.PI) * Math.asin(Math.sin(x));
  },
  _randomBetween(min, max) {
    return (min + (Math.random() * (max - min)));
  },
  _randomIndex(arr, except = null) {
    if (!arr || arr.length === 0) {
      return null;
    }
    let index;
    do {
      index = (Math.floor(Math.random() * arr.length));
    } while (index == except);
    return index;
  },
  _randomIndexWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
      return null;
    }
    let index;
    do {
      index = (Math.floor(Math.random() * arr.length));
    } while (!predicate(index));
    return index;
  },
  _randomValue(arr, except = null) {
    if (!arr || arr.length === 0) {
      return null;
    }
    let value;
    do {
      value = arr[(Math.floor(Math.random() * arr.length))];
    } while (value == except);
    return value;
  },
  _randomValueWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
      return null;
    }
    let value;
    do {
      value = arr[(Math.floor(Math.random() * arr.length))];
    } while (!predicate(value));
    return value;
  },
  _isBeatDivision(beat, division, allowFirst = false) {
    if (allowFirst) {
      return beat % division === 0;
    }
    return (beat > 0 && beat % division === 0);
  },
  _step(value, step = 1) {
    return (Math.round(value / step) * step);
  },
  _smoothFollow(device, varName, divider = 1, value = null, initValue = null) {
    if (value === null) {
      value = device.getVar(varName);
    }
    const followVarName = `${varName}__follow`;
    if (!device.varIsSet(followVarName)) {
      device.setVar(followVarName, initValue !== null ? initValue : value);
    }
    let follow = device.getVar(followVarName);
    const diff = value - follow;
    follow += diff / divider;
    device.setVar(followVarName, follow);
    return follow;
  },
  _smoothReset(device, varName, value = null) {
    if (value === null) {
      value = device.getVar(varName);
    }
    const followVarName = `${varName}__follow`;
    device.setVar(followVarName, value);
    return value;
  },
  _smoothValue(device, varName) {
    const followVarName = `${varName}__follow`;
    return device.getVar(followVarName);
  },
  _smoothVarName(device, varName) {
    const followVarName = `${varName}__follow`;
    return followVarName;
  },
  // eases
  _backInOut: eases.backInOut,
  _bounceOut: eases.bounceOut,
}
