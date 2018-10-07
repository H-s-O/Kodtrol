import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TimelineLayer from '../timeline/TimelineLayer';
import parseTimeline from '../../../../common/js/lib/parseTimeline';
import percentString from '../../lib/percentString';

import styles from '../../../styles/components/timeline/timelinedisplay.scss';

const propTypes = {
  onItemsUpdate: PropTypes.func.isRequired,
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
    
    return (
      <TimelineLayer
        key={`layer-${index}`}
        duration={duration}
        data={layerItems}
        totalLayers={layers.length}
        index={index}
        onDeleteLayer={this.onDeleteLayer}
        onDeleteItem={this.onDeleteItem}
        onEditItem={this.onEditItem}
        onAdjustItem={this.onAdjustItem}
        onCopyItem={this.onCopyItem}
        onPasteItem={this.onPasteItem}
        onAddItemAt={this.onAddItemAt}
        onAddLayer={this.onAddLayer}
      />
    );
  }
  
  render = () => {
    const { items, zoom, layers } = this.props;
    
    return (
      <div
        className={styles.timelineDisplay}
        style={{
          width: percentString(zoom),
        }}
      >
      { layers.length ? layers.map(this.renderTimelineLayer) : null }
      </div>
    );
  }
}

TimelineDisplay.propTypes = propTypes;
TimelineDisplay.defaultProps = defaultProps;

export default TimelineDisplay;