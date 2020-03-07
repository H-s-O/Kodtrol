export default class TriggerRenderer {
  _triggered = false;

  reset = () => {
    this._triggered = false;
  }

  render = () => {
    this._triggered = true;
  }
}
