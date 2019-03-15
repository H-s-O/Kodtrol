import React, { PureComponent } from 'react';
import classNames from 'classnames'
import Color from 'color';
import AudioSVGWaveform from 'audio-waveform-svg-path';

import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/timeline/timelineaudiotrack.scss';

class TimelineAudioTrack extends PureComponent {
  trackWaveform = null;
  state = {
    trackWaveformData: null,
    trackWaveformWidth: null,
  };
  
  componentDidMount = () => {
    const { data } = this.props;
    const { file } = data;
    
    this.trackWaveform = new AudioSVGWaveform({
      url: `file://${file}`,
    });
    this.trackWaveform.loadFromUrl().then(this.waveformLoaded);
  }
  
  componentWillUnmount = () => {
    if (this.trackWaveform) {
      if (this.trackWaveform.context) {
        // Homemade destroy
        this.trackWaveform.context.close();
      }
    }
    
    this.trackWaveformData = null;
    this.trackWaveform = null;
  }
  
  waveformLoaded = () => {
    const trackWaveformData = this.trackWaveform.getPath();
    
    // Parse the last "moveto" command of the waveform path to
    // find the waveform width
    const lastM = trackWaveformData.lastIndexOf('M');
    const mComma = trackWaveformData.indexOf(',', lastM);
    const trackWaveformWidth = Number(trackWaveformData.slice(lastM + 1, mComma)) + 1; // include the last line
    
    this.setState({
      trackWaveformData,
      trackWaveformWidth,
    });
  }
  
  generateLabel = () => {
    const { data } = this.props;
    const { name, volume } = data;
    
    const label = `${name} [volume: ${volume}]`;
    
    return label;
  }
  
  renderWaveform = () => {
    const { trackWaveformData, trackWaveformWidth } = this.state;
    if (!trackWaveformData || !trackWaveformWidth) {
      return null;
    }
    
    const { data } = this.props;
    const { color } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <svg
        className={classNames({
          [styles.waveform]: true,
          [styles.lightColor]: lightColor,
        })}
        viewBox={`0 -1 ${trackWaveformWidth} 2`}
        preserveAspectRatio="none"
      >
        <path
          d={trackWaveformData}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  render = () => {
    return (
      <TimelineItem
        {...this.props}
        typeLabel='audio track'
        getItemLabel={this.generateLabel}
        canPasteStartTime={false}
        canPasteEndTime={false}
      >
        { this.renderWaveform() }
      </TimelineItem>
    );
  }
}

export default TimelineAudioTrack;
