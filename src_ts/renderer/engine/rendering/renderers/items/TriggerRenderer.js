export default class TriggerRenderer {
  _triggered = false;

  get triggered() {
    return this._triggered;
  }

  reset() {
    this._triggered = false;
  }

  render() {
    this._triggered = true;
  }

  destroy() {
    this._triggered = null;
  }
}
