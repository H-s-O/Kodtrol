import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames'
import Color from 'color';
import uniqid from 'uniqid';

import percentString from '../../lib/percentString';
import stopEvent from '../../lib/stopEvent';
import parseCurve from '../../../../common/js/lib/parseCurve';
import TimelineItem from './TimelineItem';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelinecurve.scss';

class TimelineCurve extends PureComponent {
  container = null;
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
  
  constructor(props) {
    super(props);
    
    const { data } = props;
    const { curve } = data;
    if (curve) {
      this.state = {
        curveTemp: curve,
      };
    }
  }
  
  onPointClick = (e, pointId) => {
    stopEvent(e);
    
    const { curveTemp } = this.state;
    const newCurve = curveTemp.filter(({id}) => id !== pointId);
    
    this.doUpdate(newCurve);
  }
  
  getContainerCoordsFromEvent = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = this.container.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = 1 - ((clientY - top) / height);
    return {
      x,
      y,
    };
  }
  
  onContainerClick = (e) => {
    stopEvent(e);
    
    const coords = this.getContainerCoordsFromEvent(e);
    // console.log(coords);
    
    const newPoint = {
      ...coords,
      id: uniqid(),
    };
    const { curveTemp } = this.state;
    const newCurve = [
      ...curveTemp,
      newPoint,
    ];
    
    this.doUpdate(newCurve);
  }
  
  doUpdate = (curve) => {
    this.setState({
      curveTemp: curve,
    });
    
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
  
  renderCurveItems = (lightColor) => {
    const { data } = this.props;
    const { curve } = data;
    const { curveTemp } = this.state;
    
    const curveData = curveTemp || curve;
    
    return (
      <Fragment>
        { this.renderCurve(curveData, lightColor) }
        { this.renderPoints(curveData, lightColor) }
      </Fragment>
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
  
  setContainerRef = (ref) => {
    this.container = ref;
  }
  
  render = () => {
    return (
      <TimelineItem
        {...this.props}
        typeLabel='curve'
        renderContent={this.renderCurveItems}
        getItemLabel={this.generateLabel}
      />
    );
  }
}

export default timelineConnect(TimelineCurve);
