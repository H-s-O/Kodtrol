import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';

import percentString from '../../../lib/percentString';
import isFunction from '../../lib/isFunction';
import { deleteWarning } from '../../lib/messageBoxes';

import styles from '../../../../styles/components/layer_editor/layer.scss';

const propTypes = {
  data: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})),
  renderItemComponent: PropTypes.func,
  renderLayerContextMenu: PropTypes.func,
  //
  editorDeleteLayer: PropTypes.func,
  editorPasteItemHere: PropTypes.func,
  editorAddItemAt: PropTypes.func,
  editorAddLayer: PropTypes.func,
  editorMoveLayer: PropTypes.func,
  editorCanPasteItem: PropTypes.func,
  editorCanMoveLayerUp: PropTypes.func,
  editorCanMoveLayerDown: PropTypes.func,
};

const defaultProps = {
  data: null,
  items: null,
  renderItemComponent: null,
  renderLayerContextMenu: null,
};

class Layer extends PureComponent {
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
  
  doDeleteLayer = () => {
    const { editorDeleteLayer, data } = this.props;
    const { id } = data;
    editorDeleteLayer(id);
  }
  
  onPasteItemHere = (e) => {
    e.persist(); // needed so that it can be forwarded

    const { editorPasteItemHere, data } = this.props;
    const { id } = data;
    editorPasteItemHere(id, '*', e);
  }
  
  doAddItemAt = (type, e) => {
    const { editorAddItemAt, data } = this.props;
    const { id } = data;
    editorAddItemAt(id, type, e);
  }
  
  onAddLayerAboveClick = () => {
    const { editorAddLayer, data } = this.props;
    const { order } = data;
    editorAddLayer(order + 1);
  }
  
  onAddLayerBelowClick = () => {
    const { editorAddLayer, data } = this.props;
    const { order } = data;
    editorAddLayer(order);
  }
  
  onMoveLayerUpClick = () => {
    const { editorMoveLayer, data } = this.props;
    const { id } = data;
    editorMoveLayer(id, 1);
  }
  
  onMoveLayerDownClick = () => {
    const { editorMoveLayer, data } = this.props;
    const { id } = data;
    editorMoveLayer(id, -1);
  }
  
  onLayerContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const {
      renderLayerContextMenu,
      editorCanPasteItem,
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
      {
        type: 'separator',
      },
      {
        label: 'Paste item here',
        click: () => this.onPasteItemHere(e),
        enabled: editorCanPasteItem('*'),
      },
    ];
    
    if (isFunction(renderLayerContextMenu)) {
      template = renderLayerContextMenu(template);
    }
    
    const menu = Menu.buildFromTemplate(template);
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  renderItem = (item, index, items) => {
    const { renderItemComponent } = this.props;

    if (isFunction(renderItemComponent)) {
      const result = renderItemComponent(item, index, items);

      if (!result) {
        return null;
      }

      const { 
        component: ComponentClass,
        leftPercent,
        widthPercent
      } = result;

      const style = {
        left: percentString(leftPercent),
        width: percentString(widthPercent),
      }

      return (
        <ComponentClass
          key={`item-${index}`}
          data={item}
          style={style}
        />
      );
    }
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
