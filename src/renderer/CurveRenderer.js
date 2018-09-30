import parseCurve from '../common/js/lib/parseCurve';

export default class CurveRenderer {
  started = false;
  curveData = null;
  
  constructor(sourceCurve) {
    const { curve } = sourceCurve;
    this.curveData = parseCurve(curve);
  }
  
  reset = () => {
    this.started = false;
  }
  
  render = (delta, curveInfo) => {
    this.started = true;
    
    const { curvePercent } = curveInfo;
    
    const before = this.curveData.reduce((val, point) => {
      return point.x <= curvePercent ? point : val;
    }, {x: 0});
    const after = this.curveData.reduceRight((val, point) => {
      return point.x >= curvePercent ? point : val;
    }, {x: 1});
    // Guard
    if (!before || !after) {
      return 0.0;
    }
    
    const { x:startX, y:startY } = before;
    const { x:endX, y:endY } = after;
    const relativePercent = (curvePercent - startX) / (endX - startX);
    const output = Math.abs(startY + (relativePercent * (endY - startY)));
    
    return output;
  }
  
  destroy = () => {
    this.curveData = null;
  }
}