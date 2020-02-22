import React, { PureComponent } from 'react';
import classNames from 'classnames'
import Color from 'color';
import uniqid from 'uniqid';

import percentString from '../../lib/percentString';
import stopEvent from '../../lib/stopEvent';
import parseCurve from '../../../../common/js/lib/parseCurve';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/timeline/timelinecurve.scss';

class TimelineCurve extends PureComponent {
  container = null;
  
  onPointClick = (e, pointId) => {
    stopEvent(e);
    
    const { data } = this.props;
    const { curve } = data;
    const newCurve = curve.filter(({id}) => id !== pointId);
    
    this.doUpdate(newCurve);
  }
  
  getContainerCoordsFromEvent = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = this.container.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = 1 - ((clientY - top) / height);
    
    return {
      x: x < 0 ? 0 : x > 1 ? 1 : x,
      y: y < 0 ? 0 : y > 1 ? 1 : y,
    };
  }
  
  onContainerClick = (e) => {
    stopEvent(e);
    
    const coords = this.getContainerCoordsFromEvent(e);
    
    const newPoint = {
      ...coords,
      id: uniqid(),
    };
    
    const { data } = this.props;
    const { curve } = data;
    
    const newCurve = [
      ...curve,
      newPoint,
    ];
    
    this.doUpdate(newCurve);
  }
  
  doUpdate = (curve) => {
    const { timelineUpdateItem, data } = this.props;
    const { id } = data;
    timelineUpdateItem(id, {
      curve,
    });
  }
  
  generateLabel = () => {
    const { data } = this.props;
    const { curve, name } = data;
    
    const label = `${name} [${curve.length} points]`;
    
    return label;
  }
  
  setContainerRef = (ref) => {
    this.container = ref;
  }
  
  renderCurveItems = () => {
    const { data } = this.props;
    const { curve, color } = data;

    const lightColor = Color(color).isLight();
    const curveData = parseCurve(curve);
    
    return (
      <div
        ref={this.setContainerRef}
        onClick={this.onContainerClick}
        className={styles.container}
      >
        { this.renderCurve(curveData, lightColor) }
        { this.renderPoints(curveData, lightColor) }
      </div>
    )
  }
  
  renderCurve = (curve, lightColor) => {
    if (!curve.length) {
      return null;
    }
    
    const bgPath = curve
      .map(({x,y}) => {
        return `${x},${(1 - y)}`;
      })
      .join(' ');
    
    // vectorEffect="non-scaling-stroke" saves lives
    return (
      <svg
        className={classNames({
          [styles.curveGraph]: true,
          [styles.lightColor]: lightColor,
        })}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <polyline
          points={bgPath}
          vectorEffect="non-scaling-stroke"
          strokeWidth="2"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="0"
        />
      </svg>
    );
    
    return null;
  }
  
  renderPoints = (curve, lightColor) => {
    if (!curve.length) {
      return null;
    }
      
    return curve.map(({x,y,id,extra}, index) => {
      if (extra) {
        return null;
      }
      
      return (
        <div
          className={classNames({
            [styles.curvePoint]: true,
            [styles.lightColor]: lightColor,
          })}
          key={`point-${index}`}
          style={{
            left: percentString(x),
            top: percentString(1 - y),
          }}
          onClick={(e) => this.onPointClick(e, id)}
        >
        </div>
      );
    })
  }
  
  render = () => {
    return (
      <TimelineItem
        {...this.props}
        typeLabel='curve'
        getItemLabel={this.generateLabel}
      >
        { this.renderCurveItems() }
      </TimelineItem>
    );
  }
}

export default TimelineCurve;
