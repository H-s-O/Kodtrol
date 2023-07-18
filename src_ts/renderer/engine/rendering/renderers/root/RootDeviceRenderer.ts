import BaseRootRenderer from './BaseRootRenderer';

export default class RootDeviceRenderer extends BaseRootRenderer {
  _instance = null;

  constructor(providers, deviceId) {
    super(providers);

    this._setDeviceInstance(deviceId);
  }

  _setDeviceInstance(deviceId) {
    this._instance = this._providers.getDevice(deviceId);
  }

  get device() {
    return this._instance;
  }

  _runFrame(frameTime) {
    if (this._instance) {
      this._instance.applyTestValues();
    }
  }

  destroy() {
    if (this._instance) {
      this._instance.destroy();
      this._instance = null;
    }

    super.destroy();
  }
}
