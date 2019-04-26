import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Layer from './Layer';
import percentString from '../../../lib/percentString';

import styles from '../../../../styles/components/layer_editor/layereditor.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({})),
  minLayerCount: PropTypes.number,
};

const defaultProps = {
  items: [],
  layers: [],
  minLayerCount: 4,
};

class LayerEditor extends PureComponent {
  renderTimelineLayer = (layer, index, layers) => {
    const { items, minLayerCount, ...otherProps } = this.props;
    const { id } = layer;
    
    const layerItems = items.filter(({layer}) => layer === id);
    const layersCount = Math.max(minLayerCount, layers.length);
    const layerHeight = (1 / layersCount);
    const top = percentString(1 - ((index + 1) * layerHeight));
    const height = percentString(layerHeight * 0.9);
    const style = {
      top,
      height,
    };
    
    return (
      <Layer
        {...otherProps}
        key={`layer-${index}`}
        data={layer}
        items={layerItems}
        style={style}
      />
    );
  }
  
  render = () => {
    const { layers } = this.props;
    const sortedLayers = layers.sort((a, b) => a.order - b.order);
    
    return (
      <div
        className={styles.timelineDisplay}
      >
      { sortedLayers && sortedLayers.length ? sortedLayers.map(this.renderTimelineLayer) : null }
      </div>
    );
  }
}

LayerEditor.propTypes = propTypes;
LayerEditor.defaultProps = defaultProps;

export default LayerEditor;
