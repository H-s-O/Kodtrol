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
  trackWaveformWidth = 0;
  
  constructor(props) {
    super(props);
    
    const { data } = props;
    const { id } = data;
    this.trackWaveform = new AudioSVGWaveform({
      url: `http://localhost:5555/current-timeline/blocks/${id}/file`,
    });
    this.trackWaveform.loadFromUrl().then(this.waveformLoaded);
  }
  
  waveformLoaded = () => {
    this.trackWaveformData = this.trackWaveform.getPath();
    
    // Parse the last "moveto" command of the waveform path to
    // find the waveform width
    const lastM = this.trackWaveformData.lastIndexOf('M');
    const mComma = this.trackWaveformData.indexOf(',', lastM);
    const width = Number(this.trackWaveformData.slice(lastM + 1, mComma)) + 1; // include the last line
    this.trackWaveformWidth = width;
    
    // Force re-render to display waveform
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
        viewBox={`0 -1 ${this.trackWaveformWidth} 2`}
        preserveAspectRatio="none"
      >
        <path
          d={this.trackWaveformData}
          strokeWidth="1"
        />
      </svg>
    );
  }

  render = () => {
    const { data, layerDuration } = this.props;
    const { inTime, outTime, name, color, volume } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <TimelineItem
        {...this.props}
        typeLabel='audio track'
        canPasteStartTime={false}
        canPasteEndTime={false}
      >
        <div
          className={classNames({
            [styles.timelineAudioTrack]: true,
            [styles.lightAudioTrack]: lightColor,
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
              { volume > 0 ? '' : ' [muted]' } 
            </span>
          </div>
        </div>
      </TimelineItem>
    );
  }
}

export default TimelineAudioTrack;
