export default class AbstractProxy {
  _proxyTarget = null;
  
  constructor(proxyTarget) {
    this._proxyTarget = proxyTarget;
    
    this.setProxiedMembers(proxyTarget);
  }
  
  setProxiedMembers = (target) => {
    for (let prop in target) {
      if (typeof target[prop] === 'function') {
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