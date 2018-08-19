import React, { PureComponent } from 'react';
import classNames from 'classnames'
import { remote } from 'electron';
import Color from 'color';
import AudioSVGWaveform from 'audio-waveform-svg-path';

import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/partials/timeline.scss';

class TimelineAudioTrack extends PureComponent {
  trackWaveform = null;
  trackWaveformData = null;
  
  constructor(props) {
    super(props);
    
    const { data } = props;
    const { name } = data;
    this.trackWaveform = new AudioSVGWaveform({
      url: `http://localhost:5555/${name}`,
    });
    this.trackWaveform.loadFromUrl().then(this.waveformLoaded);
  }
  
  waveformLoaded = () => {
    this.trackWaveformData = this.trackWaveform.getPath();
    this.forceUpdate();
  }
  
  onStartAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('inTime');
  }

  onEndAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('outTime');
  }
  
  doDragAnchorDown = (mode) => {
    const { onAdjustItem, index } = this.props;
    onAdjustItem(index, mode);
  }
  
  renderWaveform = () => {
    if (!this.trackWaveformData) {
      return null;
    }
    
    return (
      <svg
        className={classNames({
          [styles.waveform]: true,
        })}
        preserveAspectRatio="none"
      >
        <path
          d={this.trackWaveformData}
          width="100%"
          stroke="red"
          strokeWidth="1"
          transform="translate(0, 25) scale(1, 20)"
        />
      </svg>
    );
  }

  render = () => {
    const { data, layerDuration } = this.props;
    const { inTime, outTime, name, color } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <TimelineItem
        {...this.props}
        typeLabel='audio track'
      >
        <div
          className={classNames({
            [styles.timelineAudioTrack]: true,
            [styles.lightBlock]: lightColor,
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
            { this.renderWaveform() }
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
              className={styles.timelineAudioTrackLabel}
            >
              { name }
            </span>
          </div>
        </div>
      </TimelineItem>
    );
  }
}

export default TimelineAudioTrack;
