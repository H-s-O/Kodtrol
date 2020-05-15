export default class AbstractProxy {
  _proxyTarget = null;

  constructor(proxyTarget) {
    this._proxyTarget = proxyTarget;

    this._setProxiedMembers(proxyTarget);
  }

  _setProxiedMembers(target) {
    for (let prop in target) {
      if (typeof target[prop] === 'function' && prop.charAt(0) !== '_') {
        this[prop] = (...args) => {
          return Reflect.apply(target[prop], target, args);
        };
      }
    }
  }

  destroy = () => {
    this._proxyTarget = null;
  }
}
