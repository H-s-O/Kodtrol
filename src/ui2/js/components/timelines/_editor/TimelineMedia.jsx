import React, { PureComponent } from 'react';
import classNames from 'classnames'
import Color from 'color';
import AudioSVGWaveform from '../../../../ui2/js/lib/AudioSVGWaveform';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/timeline/timelineaudiotrack.scss';

class TimelineMedia extends PureComponent {
  trackWaveform = null;
  state = {
    trackWaveformData: null,
    trackWaveformWidth: null,
  };

  componentDidMount = () => {
    const { relatedMedia } = this.props;
    if (!relatedMedia) {
      return;
    }

    const { file } = relatedMedia;

    this.trackWaveform = new AudioSVGWaveform(`file://${file}`);
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
    const { data, relatedMedia } = this.props;
    const { name, volume } = data;
    const mediaName = relatedMedia ? relatedMedia.name : null;
    const finalName = name || mediaName;

    const label = `${finalName} [volume: ${volume}]`;

    return label;
  }

  renderWaveform = () => {
    const { trackWaveformData, trackWaveformWidth } = this.state;
    if (!trackWaveformData || !trackWaveformWidth) {
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
    const { data, relatedMedia, ...otherProps } = this.props;
    const blockName = data.name;
    const mediaName = relatedMedia ? relatedMedia.name : null;
    const finalName = blockName || mediaName;

    return (
      <TimelineItem
        {...otherProps}
        data={{
          ...data,
          name: finalName,
        }}
        typeLabel='media'
        getItemLabel={this.generateLabel}
        canPasteStartTime={false}
        canPasteEndTime={false}
      >
        {this.renderWaveform()}
      </TimelineItem>
    );
  }
}

const relatedMediaSelector = createSelector(
  [
    (state, props) => state.medias,
    (state, props) => props.data.media,
  ],
  (medias, relatedMediaId) => {
    if (!relatedMediaId) {
      return null;
    }
    const media = medias.find(({ id }) => id === relatedMediaId);
    if (!media) {
      return null;
    }
    return media;
  }
);

const mapStateToProps = (state, props) => {
  return {
    relatedMedia: relatedMediaSelector(state, props),
  };
};

export default connect(mapStateToProps)(TimelineMedia);
