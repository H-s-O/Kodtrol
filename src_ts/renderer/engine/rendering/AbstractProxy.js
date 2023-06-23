export default class AbstractProxy {
  _proxyTarget = null;

  constructor(proxyTarget) {
    this._proxyTarget = proxyTarget;

    this._setProxiedMembers(proxyTarget);
  }

  _setProxiedMembers(target) {
    // Class methods
    let protoKeys = [];
    let obj = target;
    while (obj = Reflect.getPrototypeOf(obj)) {
      const keys = Reflect.ownKeys(obj);
      protoKeys = protoKeys.concat(keys);
    }

    // Dynamically created methods
    const dynKeys = Reflect.ownKeys(target);

    const allKeys = protoKeys.concat(dynKeys);
    const len = allKeys.length;
    for (let i = 0; i < len; i++) {
      const prop = allKeys[i];
      if (typeof target[prop] === 'function' && prop.charAt(0) !== '_' && !(prop in this)) {
        this[prop] = (...args) => Reflect.apply(target[prop], target, args);
      }
    }
  }

  destroy() {
    this._proxyTarget = null;
  }
}
