import parseCurve from '../../../../common/js/lib/parseCurve';

export default class CurveRenderer {
  _started = false;
  _curveData = null;

  constructor({ curve }) {
    this._curveData = parseCurve(curve);
  }

  reset() {
    this._started = false;
  }

  render(delta, curveInfo) {
    this._started = true;

    const { curvePercent } = curveInfo;

    const before = this._curveData.reduce((val, point) => {
      return point.x <= curvePercent ? point : val;
    }, { x: 0 });
    const after = this._curveData.reduceRight((val, point) => {
      return point.x >= curvePercent ? point : val;
    }, { x: 1 });
    // Guard
    if (!before || !after) {
      return 0.0;
    }

    const { x: startX, y: startY } = before;
    const { x: endX, y: endY } = after;
    const relativePercent = (curvePercent - startX) / (endX - startX);
    const output = Math.abs(startY + (relativePercent * (endY - startY)));

    return output;
  }

  destroy() {
    this._started = null;
    this._curveData = null;
  }
}
