import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import classNames from 'classnames'
import { remote } from 'electron';

import { deleteWarning } from '../../lib/messageBoxes';
import isFunction from '../../lib/isFunction';

import styles from '../../../styles/components/board/boarditem.scss';

const propTypes = {
  data: PropTypes.shape({}).isRequired,
  boardDeleteItem: PropTypes.func.isRequired,
  boardEditItem: PropTypes.func.isRequired,
  boardCopyItem: PropTypes.func.isRequired,
  boardPasteItem: PropTypes.func.isRequired,
  boardItemMouseDown: PropTypes.func.isRequired,
  boardItemMouseUp: PropTypes.func.isRequired,
  layerEditorCanChangeItemLayerUp: PropTypes.func.isRequired,
  layerEditorCanChangeItemLayerDown: PropTypes.func.isRequired,
  layerEditorChangeItemLayer: PropTypes.func.isRequired,
  //
  getItemLabel: PropTypes.func,
  getDialogLabel: PropTypes.func,
  type: PropTypes.oneOf(['block']),
  typeLabel: PropTypes.string,
  active: PropTypes.bool,
};

const defaultProps = {
  type: 'block',
  typeLabel: 'item',
  active: false,
};

class BoardItem extends PureComponent {
  //////////////////////////////////////////////////////////
  // EVENT HANDLERS

  onDeleteItemClick = () => {
    const { getDialogLabel, data } = this.props;
    const { name } = data;
    const label = isFunction(getDialogLabel) ? getDialogLabel() : name;

    deleteWarning(`Are you sure you want to delete "${label}" ?`, (result) => {
      if (result) {
        this.doDeleteItem();
      }
    });
  }
  
  onEditItemClick = () => {
    this.doEditItem();
  }

  onCopyItemClick = () => {
    this.doCopyItem('*');
  }
  
  onCopyItemTypeClick = () => {
    this.doCopyItem('type');
  }

  onPasteItemTypeClick = () => {
    this.doPasteItem('type');
  }

  onChangeItemLayerUp = () => {
    this.doChangeLayerUp();
  }
  
  onChangeItemLayerDown = () => {
    this.doChangeLayerDown();
  }

  onContextMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.doContextMenu();
  }

  //////////////////////////////////////////////////////////
  // ACTIONS
  
  onMouseDown = () => {
    this.doMouseDown();
  }
  
  onMouseUp = () => {
    this.doMouseUp();
  }

  doDeleteItem = () => {
    const { boardDeleteItem, data } = this.props;
    const { id } = data;
    boardDeleteItem(id);
  }

  doEditItem = () => {
    const { boardEditItem, data } = this.props;
    const { id } = data;
    boardEditItem(id);
  }

  doCopyItem = (mode) => {
    const { boardCopyItem, data } = this.props;
    const { id } = data;
    boardCopyItem(id, mode);
  }

  doPasteItem = (mode) => {
    const { boardPasteItem, data } = this.props;
    const { id } = data;
    boardPasteItem(id, mode);
  }

  doMouseDown = () => {
    const { data, boardItemMouseDown } = this.props;
    const { id } = data;
    boardItemMouseDown(id);
  }
  
  doMouseUp = () => {
    const { data, boardItemMouseUp } = this.props;
    const { id } = data;
    boardItemMouseUp(id);
  }

  doChangeLayerUp = () => {
    const { layerEditorChangeItemLayer, data } = this.props;
    const { id } = data;
    layerEditorChangeItemLayer(id, 1);
  }
  
  doChangeLayerDown = () => {
    const { layerEditorChangeItemLayer, data } = this.props;
    const { id } = data;
    layerEditorChangeItemLayer(id, -1);
  }

  doContextMenu = () => {
    const {
      typeLabel,
      boardCanPasteItem,
      layerEditorCanChangeItemLayerUp,
      layerEditorCanChangeItemLayerDown,
      data,
    } = this.props;
    const { id } = data;
    const { Menu } = remote;

    const template = [
      {
        label: 'Move to layer above',
        click: this.onChangeItemLayerUp,
        enabled: layerEditorCanChangeItemLayerUp(id),
      },
      {
        label: 'Move to layer below',
        click: this.onChangeItemLayerDown,
        enabled: layerEditorCanChangeItemLayerDown(id),
      },
      {
        type: 'separator',
      },
      {
        label: `Edit ${typeLabel}...`,
        click: this.onEditItemClick,
      },
      {
        label: `Delete ${typeLabel}...`,
        click: this.onDeleteItemClick,
      },
      {
        type: 'separator',
      },
      {
        label: `Copy ${typeLabel}`,
        click: this.onCopyItemClick,
      },
      {
        label: `Copy ${typeLabel} type`,
        click: this.onCopyItemTypeClick,
      },
      {
        label: `Paste ${typeLabel} type`,
        click: this.onPasteItemTypeClick,
        enabled: boardCanPasteItem('type'),
      },
    ];
    
    const menu = Menu.buildFromTemplate(template);
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  //////////////////////////////////////////////////////
  // RENDERS
  
  renderBlockType = () => {
    const { style, data, getItemLabel, children, active } = this.props;
    const { color, name } = data;

    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.boardItem]: true,
          [styles.lightColor]: lightColor,
        })}
        style={{
          ...style,
          backgroundColor: color,
        }}
        onContextMenu={this.onContextMenuClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <div
          className={styles.header}
        >
          <div
            className={classNames({
              [styles.itemLabel]: true,
            })}
          >
           { isFunction(getItemLabel) ? getItemLabel() : name }
          </div>
        </div>
        <div
          className={classNames({
            [styles.content]: true,
            [styles.anim]: active,
          })}
        >
          { children }
        </div>
      </div>
    );
  }

  render = () => {
    const { type } = this.props;
    return type === 'simple' ? this.renderSimpleType() : this.renderBlockType();
  }
}

BoardItem.propTypes = propTypes;
BoardItem.defaultProps = defaultProps;

export default BoardItem;
