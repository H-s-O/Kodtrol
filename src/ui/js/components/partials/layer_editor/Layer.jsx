import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';

import isFunction from '../../../lib/isFunction';
import { deleteWarning } from '../../../lib/messageBoxes';

import styles from '../../../../styles/components/layer_editor/layer.scss';

const propTypes = {
  data: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})),
  renderItemComponent: PropTypes.func,
  renderLayerContextMenu: PropTypes.func,
  editorChangeItemLayer: PropTypes.func.isRequired,
  //
  editorDeleteLayer: PropTypes.func,
  editorAddItemAt: PropTypes.func,
  editorAddLayer: PropTypes.func,
  editorMoveLayer: PropTypes.func,
  editorCanMoveLayerUp: PropTypes.func,
  editorCanMoveLayerDown: PropTypes.func,
  editorCanChangeItemLayerUp: PropTypes.func,
  editorCanChangeItemLayerDown: PropTypes.func,
};

const defaultProps = {
  data: null,
  items: null,
  renderItemComponent: null,
  renderLayerContextMenu: null,
};

class Layer extends PureComponent {
  ///////////////////////////////////////////////////////
  // EVENT HANDLERS

  onDeleteLayerClick = () => {
    const { data, items } = this.props;
    const { order } = data;
    const message = `Are you sure you want to delete layer ${order + 1}?`;
    const details = items && items.length > 0 ? `This layer contains ${items.length} item(s).` : null;
    
    deleteWarning(message, details, (result) => {
      if (result) {
        this.doDeleteLayer();
      }
    });
  }
  
  onAddLayerAboveClick = () => {
    this.doAddLayerAbove();
  }
  
  onAddLayerBelowClick = () => {
    this.doAddLayerBelow();
  }
  
  onMoveLayerUpClick = () => {
    this.doMoveLayerUp();
  }
  
  onMoveLayerDownClick = () => {
    this.doMoveLayerDown();
  }
  
  onLayerContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.persist(); // needed so that it can be forwarded
    
    this.doLayerContextMenu(e);
  }

  /////////////////////////////////////////////////////////
  // ACTIONS

  doDeleteLayer = () => {
    const { editorDeleteLayer, data } = this.props;
    const { id } = data;
    editorDeleteLayer(id);
  }

  doAddLayerAbove = () => {
    const { editorAddLayer, data } = this.props;
    const { order } = data;
    editorAddLayer(order + 1);
  }
  
  doAddLayerBelow = () => {
    const { editorAddLayer, data } = this.props;
    const { order } = data;
    editorAddLayer(order);
  }
  
  doMoveLayerUp = () => {
    const { editorMoveLayer, data } = this.props;
    const { id } = data;
    editorMoveLayer(id, 1);
  }
  
  doMoveLayerDown = () => {
    const { editorMoveLayer, data } = this.props;
    const { id } = data;
    editorMoveLayer(id, -1);
  }
  
  doLayerContextMenu = (e) => {
    const {
      renderLayerContextMenu,
      editorCanMoveLayerUp,
      editorCanMoveLayerDown,
      data,
    } = this.props;
    const { id } = data;
    const { Menu } = remote;

    let template = [
      {
        label: 'Move layer up',
        click: this.onMoveLayerUpClick,
        enabled: editorCanMoveLayerUp(id),
      },
      {
        label: 'Move layer down',
        click: this.onMoveLayerDownClick,
        enabled: editorCanMoveLayerDown(id),
      },
      {
        type: 'separator',
      },
      {
        label: 'Add layer above',
        click: this.onAddLayerAboveClick,
      },
      {
        label: 'Add layer below',
        click: this.onAddLayerBelowClick,
      },
      {
        type: 'separator',
      },
      {
        label: 'Delete layer...',
        click: this.onDeleteLayerClick,
      },
    ];
    
    if (isFunction(renderLayerContextMenu)) {
      template = renderLayerContextMenu(template, id, e);
    }
    
    const menu = Menu.buildFromTemplate(template);
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  /////////////////////////////////////////////////////////
  // RENDERS

  renderItem = (item, index, items) => {
    const {
      renderItemComponent,
      editorCanChangeItemLayerUp,
      editorCanChangeItemLayerDown,
      editorChangeItemLayer,
    } = this.props;

    const callbacks = {
      layerEditorCanChangeItemLayerUp: editorCanChangeItemLayerUp,
      layerEditorCanChangeItemLayerDown: editorCanChangeItemLayerDown,
      layerEditorChangeItemLayer: editorChangeItemLayer,
    };

    if (isFunction(renderItemComponent)) {
      return renderItemComponent(item, index, items, callbacks);
    }

    return null;
  }

  render = () => {
    const { items, style } = this.props;
    
    return (
      <div
        style={style}
        className={styles.timelineLayer}
        onContextMenu={this.onLayerContextMenu}
      >
        { items && items.length ? items.map(this.renderItem) : null }
      </div>
    );
  }
}

Layer.propTypes = propTypes;
Layer.defaultProps = defaultProps;

export default Layer;
