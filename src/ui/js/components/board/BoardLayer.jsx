import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { remote } from 'electron';

import percentString from '../../lib/percentString';
import { deleteWarning } from '../../lib/messageBoxes';
import BoardBlock from './BoardBlock';
import boardConnect from './boardConnect';

import styles from '../../../styles/components/board/boardlayer.scss';

const propTypes = {
  data: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  data: null,
  items: null,
};

class BoardLayer extends PureComponent {
  onDeleteLayerClick = () => {
    const { data } = this.props;
    const { order } = data;
    deleteWarning(
      `Are you sure you want to delete layer ${order + 1} ? Deleting a layer will also delete all its items.`,
      (result) => {
        if (result) {
          this.doDeleteLayer();
        }
      }
    );
  }
  
  doDeleteLayer = () => {
    const { boardDeleteLayer, data } = this.props;
    const { id } = data;
    boardDeleteLayer(id);
  }
  
  onPasteItemHere = (e) => {
    const { boardPasteItem, data } = this.props;
    const { id } = data;
    boardPasteItem(id, '*', e);
  }
  
  onAddBlockHereClick = (e) => {
    this.doAddItemAt('block', e);
  }
  
  doAddItemAt = (type, e) => {
    const { boardAddItemAt, data } = this.props;
    const { id } = data;
    boardAddItemAt(id, type, e);
  }
  
  onAddLayerAboveClick = () => {
    const { boardAddLayer, data } = this.props;
    const { order } = data;
    boardAddLayer(order + 1);
  }
  
  onAddLayerBelowClick = () => {
    const { boardAddLayer, data } = this.props;
    const { order } = data;
    boardAddLayer(order);
  }
  
  onBoardLayerContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const { boardCanPasteItem } = this.props;
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Add layer above',
      click: this.onAddLayerAboveClick,
    }));
    menu.append(new MenuItem({
      label: 'Add layer below',
      click: this.onAddLayerBelowClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Delete layer...',
      click: this.onDeleteLayerClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Paste item here',
      click: () => this.onPasteItemHere(e),
      enabled: boardCanPasteItem('*'),
    }));
    menu.append(new MenuItem({
      label: 'Add block...',
      click: () => this.onAddBlockHereClick(e),
    }));
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  renderTimelineItem = (item, index, items) => {
    let ComponentClass = null;
    if ('script' in item) {
      ComponentClass = BoardBlock;
    }
    
    if (ComponentClass == null) {
      return null;
    }
    
    const itemsCount = Math.max(4, items.length);
    const itemWidth = (1 / itemsCount) * 0.95;
    const left = percentString((index * itemWidth) * 1.05);
    const width = percentString(itemWidth);
    const style = {
      left,
      width,
    };
    
    return (
      <ComponentClass
        key={`item-${index}`}
        data={item}
        style={style}
      />
    );
  }

  render = () => {
    const { items, style } = this.props;
    
    return (
      <div
        style={style}
        className={styles.boardLayer}
        onContextMenu={this.onBoardLayerContextMenu}
      >
        { items && items.length ? items.map(this.renderTimelineItem) : null }
      </div>
    );
  }
}

BoardLayer.propTypes = propTypes;
BoardLayer.defaultProps = defaultProps;

export default boardConnect(BoardLayer);
