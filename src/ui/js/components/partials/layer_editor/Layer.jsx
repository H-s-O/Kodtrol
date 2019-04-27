import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';

import percentString from '../../../lib/percentString';
import isFunction from '../../../lib/isFunction';
import { deleteWarning } from '../../../lib/messageBoxes';

import styles from '../../../../styles/components/layer_editor/layer.scss';

const propTypes = {
  data: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})),
  renderItemComponent: PropTypes.func,
  renderLayerContextMenu: PropTypes.func,
  //
  editorDeleteLayer: PropTypes.func,
  editorAddItemAt: PropTypes.func,
  editorAddLayer: PropTypes.func,
  editorMoveLayer: PropTypes.func,
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
    e.persist(); // needed so that it can be forwarded
    
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

  renderItem = (item, index, items) => {
    const { renderItemComponent } = this.props;

    if (isFunction(renderItemComponent)) {
      return renderItemComponent(item, index, items);

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
          
        />
      );
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
