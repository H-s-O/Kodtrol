export default class CurveRenderer {
  started = false;
  
  reset = () => {
    this.started = false;
  }
  
  render = () => {
    this.started = true;
    
    return {};
  }
}