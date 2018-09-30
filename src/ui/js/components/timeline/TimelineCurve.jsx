import React, { PureComponent } from 'react';
import classNames from 'classnames'
import { remote } from 'electron';
import Color from 'color';

import percentString from '../../lib/percentString';
import parseCurve from '../../../../common/js/lib/parseCurve';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/partials/timeline.scss';

class TimelineCurve extends PureComponent {
  state = {
    curveTemp: null,
    // curveTemp: [
    //   {x: 0, y: 0},
    //   {x: 0.5, y: 0.5},
    //   {x: 0.75, y: 0.25},
    //   {x: 1, y: 1},
    //   {x: 0.3, y: 0.75},
    // ],
  };
  
  // constructor(props) {
  //   const { data } = props;
  //   const { curve } = data;
  //   if (curve) {
  //     this.state = {
  //       curve,
  //     };
  //   }
  // }
  
  onStartAnchorDown = (e) => {
    console.log('block curve start down');
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('inTime');
  }

  onEndAnchorDown = (e) => {
    console.log('block curve end down');
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('outTime');
  }
  
  doDragAnchorDown = (mode) => {
    const { onAdjustItem, index } = this.props;
    onAdjustItem(index, mode);
  }
  
  renderCurve = (curve) => {
    if (!curve.length) {
      return null;
    }
    
    const bgPath = curve
      .map(({x,y}) => {
        return `${x},${1 - y}`;
      })
      .join(' ');
    
    return (
      <svg
        className={styles.curveGraph}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <polyline
          points={bgPath}
          strokeWidth="0.02"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="0"
        />
      </svg>
    );
    
    return null;
  }
  
  renderPoints = (curve) => {
    if (!curve.length) {
      return null;
    }
      
    return curve.map(({x,y}, index) => {
      return (
        <div
          className={styles.curvePoint}
          key={`point-${index}`}
          style={{
            left: percentString(x),
            top: percentString(1 - y),
          }}
        >
        </div>
      );
    })
  }
  
  render = () => {
    const { data, layerDuration } = this.props;
    const { inTime, outTime, color, name, curve } = data;
    const { curveTemp } = this.state;
    const curveData = parseCurve(curveTemp || curve);
    const lightColor = Color(color).isLight();
    
    return (
      <TimelineItem
        {...this.props}
        typeLabel='curve'
      >
        <div
          className={classNames({
            [styles.timelineCurve]: true,
            [styles.lightCurve]: lightColor,
          })}
          style={{
            left: percentString(inTime / layerDuration),
            width: percentString((outTime - inTime) / layerDuration),
            backgroundColor: color,
          }}
        >
          <div
            className={classNames({
              [styles.bottomLayer]: true,
            })}
          >
            <div
              onMouseDown={this.onStartAnchorDown}
              className={classNames({
                [styles.dragAnchor]: true,
                [styles.leftAnchor]: true,
              })}
            />
            <div
              onMouseDown={this.onEndAnchorDown}
              className={classNames({
                [styles.dragAnchor]: true,
                [styles.rightAnchor]: true,
              })}
            />
          </div>
          <div
            className={classNames({
              [styles.middleLayer]: true,
            })}
          >
            { this.renderCurve(curveData) }
            { this.renderPoints(curveData) }
          </div>
          <div
            className={classNames({
              [styles.topLayer]: true,
            })}
          >
            <span
              style={{
                backgroundColor: color,
              }}
              className={styles.timelineCurveLabel}
            >
              { name }
            </span>
          </div>
        </div>
      </TimelineItem>
    );
  }
}

export default TimelineCurve;
