export default class TriggerRenderer {
  triggered = false;
  
  reset = () => {
    this.triggered = false;
  }
  
  render = () => {
    this.triggered = true;
  }
}