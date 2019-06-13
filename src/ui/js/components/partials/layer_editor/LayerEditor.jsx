import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';

import Layer from './Layer';
import percentString from '../../../lib/percentString';
import isFunction from '../../../lib/isFunction';
import orderSort from '../../../../../common/js/lib/orderSort';

import styles from '../../../../styles/components/layer_editor/layereditor.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({})),
  minLayerCount: PropTypes.number,
  onChange: PropTypes.func,
};

const defaultProps = {
  items: [],
  layers: [],
  minLayerCount: 4,
  onChange: null,
};

class LayerEditor extends PureComponent {
  //////////////////////////////////////////////////////////////
  // ACTIONS

  doUpdate = (data) => {
    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange(data);
    }
  }

  doAddLayer = (index) => {
    const { layers } = this.props;

    const newLayer = {
      id: uniqid(),
    };
    
    if (index === 'max') {
      newLayer.order = layers.length;
    } else if (index === 'min') {
      newLayer.order = -0.5;
    } else {
      newLayer.order = index - 0.5;
    }
    
    const newLayers = this.sortLayers([
      ...layers,
      newLayer,
    ]);
    const newData = {
      layers: newLayers,
    };
    
    this.doUpdate(newData);
  }
  
  doMoveLayer = (layerId, offset) => {
    const { layers } = this.props;
    
    const layer = layers.find(({id}) => id === layerId);
    
    const newOrder = layer.order + (offset * 1.5);
    // Guard
    if (newOrder < -1 || newOrder > layers.length) {
      return;
    }
    
    const newLayers = this.sortLayers(layers.map((layer) => {
      if (layer.id === layerId) {
        return {
          ...layer,
          order: newOrder,
        };
      }
      return layer;
    }));
    const newData = {
      layers: newLayers,
    };
    
    this.doUpdate(newData);
  }
  
  canMoveLayerUp = (layerId) => {
    const { layers } = this.props;
    
    const layer = layers.find(({id}) => id === layerId);
    
    return layer.order < layers.length - 1;
  }
  
  canMoveLayerDown = (layerId) => {
    const { layers } = this.props;
    
    const layer = layers.find(({id}) => id === layerId);
    
    return layer.order > 0;
  }
  
  doDeleteLayer = (layerId) => {
    const { layers, items } = this.props;

    const newLayers = this.sortLayers(layers.filter(({id}) => id !== layerId));
    const newItems = items.filter(({layer}) => layer !== layerId);
    const newData = {
      layers: newLayers,
      items: newItems,
    };
    
    this.doUpdate(newData);
  }
  
  sortLayers = (layers) => {
    const sortedLayers = layers
      .sort(orderSort)
      .map((layer, index) => {
        return {
          ...layer,
          order: index,
        };
      });

    return sortedLayers;
  }

  canChangeItemLayerUp = (itemId) => {
    const { layers, items } = this.props;
    
    const item = items.find(({id}) => id === itemId);
    const layerId = item.layer;
    const layer = layers.find(({id}) => id === layerId);
    
    return layer.order < layers.length - 1;
  }
  
  canChangeItemLayerDown = (itemId) => {
    const { layers, items } = this.props;
    
    const item = items.find(({id}) => id === itemId);
    const layerId = item.layer;
    const layer = layers.find(({id}) => id === layerId);
    
    return layer.order > 0;
  }

  doChangeItemLayer = (itemId, offset) => {
    const { layers, items } = this.props;
    
    const item = items.find(({id}) => id === itemId);
    const layerId = item.layer;
    const layer = layers.find(({id}) => id === layerId);
    
    const newOrder = layer.order + offset;
    // Guard
    if (newOrder < 0 || newOrder >= layers.length) {
      return;
    }

    const newLayer = layers.find(({order}) => order === newOrder);
    
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          layer: newLayer.id,
        };
      }
      return item;
    });
    const newData = {
      items: newItems,
    };
    
    this.doUpdate(newData);
  }

  /////////////////////////////////////////////////////
  // RENDERS

  renderLayer = (layer, index, layers) => {
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
        editorMoveLayer={this.doMoveLayer}
        editorAddLayer={this.doAddLayer}
        editorDeleteLayer={this.doDeleteLayer}
        editorCanMoveLayerUp={this.canMoveLayerUp}
        editorCanMoveLayerDown={this.canMoveLayerDown}
        editorChangeItemLayer={this.doChangeItemLayer}
        editorCanChangeItemLayerUp={this.canChangeItemLayerUp}
        editorCanChangeItemLayerDown={this.canChangeItemLayerDown}
      />
    );
  }
  
  render = () => {
    const { layers } = this.props;
    const sortedLayers = layers.sort(orderSort);
    
    return (
      <div
        className={styles.layerEditor}
      >
      { sortedLayers && sortedLayers.length ? sortedLayers.map(this.renderLayer) : null }
      </div>
    );
  }
}

LayerEditor.propTypes = propTypes;
LayerEditor.defaultProps = defaultProps;

export default LayerEditor;
