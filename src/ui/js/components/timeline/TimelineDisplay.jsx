import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TimelineLayer from '../timeline/TimelineLayer';
import percentString from '../../lib/percentString';

import styles from '../../../styles/components/timeline/timelinedisplay.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({})),
  zoom: PropTypes.number,
  duration: PropTypes.number,
};

const defaultProps = {
  items: [],
  layers: [],
  zoom: 1,
  duration: 0,
};

class TimelineDisplay extends PureComponent {
  renderTimelineLayer = (layer, index, layers) => {
    const { items, duration } = this.props;
    const { id } = layer;
    
    const layerItems = items.filter(({layer}) => layer === id);
    const layersCount = Math.max(4, layers.length);
    const layerHeight = (1 / layersCount);
    const top = percentString(1 - ((index + 1) * layerHeight));
    const height = percentString(layerHeight * 0.9);
    const style = {
      top,
      height,
    };
    
    return (
      <TimelineLayer
        key={`layer-${index}`}
        duration={duration}
        data={layer}
        items={layerItems}
        style={style}
      />
    );
  }
  
  render = () => {
    const { zoom, layers } = this.props;
    const sortedLayers = layers.sort((a, b) => a.order - b.order);
    
    return (
      <div
        className={styles.timelineDisplay}
        style={{
          width: percentString(zoom),
        }}
      >
      { sortedLayers && sortedLayers.length ? sortedLayers.map(this.renderTimelineLayer) : null }
      </div>
    );
  }
}

TimelineDisplay.propTypes = propTypes;
TimelineDisplay.defaultProps = defaultProps;

export default TimelineDisplay;