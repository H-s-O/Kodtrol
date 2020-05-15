import AbstractProxy from './AbstractProxy';

export default class AbstractDeviceProxy extends AbstractProxy {
  _vars = {};

  get vars() {
    return this._vars;
  }

  resetVars() {
    this._vars = {};
  }

  varIsSet(name) {
    return name in this._vars;
  }

  getVar(name) {
    return this._vars[name];
  }

  setVar(name, value) {
    this._vars[name] = value;
    return value;
  }

  updateVar(name, func) {
    return this.setVar(name, func(this.getVar(name)));
  }

  destroy() {
    this._vars = null;

    super.destroy();
  }
}
