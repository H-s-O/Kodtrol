import React, { PureComponent } from 'react';
import classNames from 'classnames'
import Color from 'color';
import AudioSVGWaveform from 'audio-waveform-svg-path';

import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelineaudiotrack.scss';

class TimelineAudioTrack extends PureComponent {
  trackWaveform = null;
  trackWaveformData = null;
  trackWaveformWidth = 0;
  
  componentDidMount = () => {
    const { data } = this.props;
    const { id } = data;
    this.trackWaveform = new AudioSVGWaveform({
      url: `http://localhost:5555/current-timeline/blocks/${id}/file`,
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
    console.log('waveformLoaded');
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
  
  generateLabel = () => {
    const { data } = this.props;
    const { name, volume } = data;
    
    let label = name;
    if (volume == 0) {
      label += ' [muted]';
    }
    
    return label;
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
        renderContent={this.renderWaveform}
        canPasteStartTime={false}
        canPasteEndTime={false}
      />
    );
  }
}

export default timelineConnect(TimelineAudioTrack);
