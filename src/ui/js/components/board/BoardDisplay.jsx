import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BoardLayer from './BoardLayer';
import percentString from '../../lib/percentString';

import styles from '../../../styles/components/board/boarddisplay.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({})),
  zoom: PropTypes.number,
};

const defaultProps = {
  items: [],
  layers: [],
  zoom: 1,
};

class BoardDisplay extends PureComponent {
  renderBoardLayer = (layer, index, layers) => {
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
      <BoardLayer
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
      { sortedLayers && sortedLayers.length ? sortedLayers.map(this.renderBoardLayer) : null }
      </div>
    );
  }
}

BoardDisplay.propTypes = propTypes;
BoardDisplay.defaultProps = defaultProps;

export default BoardDisplay;