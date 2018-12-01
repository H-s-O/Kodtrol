import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import classNames from 'classnames'
import { remote } from 'electron';

import { deleteWarning } from '../../lib/messageBoxes';
import percentString from '../../lib/percentString';
import boardConnect from './boardConnect';

import styles from '../../../styles/components/board/boarditem.scss';

const propTypes = {
  type: PropTypes.oneOf(['block', 'simple']),
  index: PropTypes.number,
  typeLabel: PropTypes.string,
  data: PropTypes.shape({}),
  layerDuration: PropTypes.number,
  renderItem: PropTypes.func,
  canCopyStartTime: PropTypes.bool,
  canCopyEndTime: PropTypes.bool,
  canPasteStartTime: PropTypes.bool,
  canPasteEndTime: PropTypes.bool,
  getItemLabel: PropTypes.func,
  getDialogLabel: PropTypes.func,
  renderContent: PropTypes.func,
};

const defaultProps = {
  type: 'block',
  typeLabel: 'item',
  canCopyStartTime: true,
  canCopyEndTime: true,
  canPasteStartTime: true,
  canPasteEndTime: true,
};

class BoardItem extends PureComponent {
  onDeleteItemClick = () => {
    const { getDialogLabel, data } = this.props;
    const { name } = data;
    const label = getDialogLabel ? getDialogLabel() : name;
    deleteWarning(`Are you sure you want to delete "${label}" ?`, (result) => {
      if (result) {
        this.doDeleteItem();
      }
    });
  }
  
  doDeleteItem = () => {
    const { timelineDeleteItem, data } = this.props;
    const { id } = data;
    timelineDeleteItem(id);
  }
  
  onEditItemClick = () => {
    const { boardEditItem, data } = this.props;
    const { id } = data;
    boardEditItem(id);
  }

  onCopyItemClick = () => {
    this.doCopyItemClick('*');
  }
  
  onCopyItemStartClick = () => {
    this.doCopyItemClick('inTime');
  }

  onCopyItemEndClick = () => {
    this.doCopyItemClick('outTime');
  }

  doCopyItemClick = (mode) => {
    const { timelineCopyItem, data } = this.props;
    const { id } = data;
    timelineCopyItem(id, mode);
  }

  onPasteItemStartClick = () => {
    this.doPasteItemClick('inTime');
  }

  onPasteItemEndClick = () => {
    this.doPasteItemClick('outTime');
  }

  doPasteItemClick = (mode) => {
    const { timelinePasteItem, data } = this.props;
    const { id } = data;
    timelinePasteItem(id, mode);
  }

  onContextMenuClick = (e) => {
    console.log('on context menu click capture');
    e.stopPropagation();
    e.preventDefault();

    const {
      typeLabel,
      canCopyStartTime,
      canCopyEndTime,
      canPasteStartTime,
      canPasteEndTime,
      boardCanPasteItem,
    } = this.props;
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: `Edit ${typeLabel}...`,
      click: this.onEditItemClick,
    }));
    menu.append(new MenuItem({
      label: `Delete ${typeLabel}...`,
      click: this.onDeleteItemClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: `Copy ${typeLabel}`,
      click: this.onCopyItemClick,
    }));
    if (canCopyStartTime) {
      menu.append(new MenuItem({
        label: `Copy ${typeLabel} start time`,
        click: this.onCopyItemStartClick,
      }));
    }
    if (canCopyEndTime) {
      menu.append(new MenuItem({
        label: `Copy ${typeLabel} end time`,
        click: this.onCopyItemEndClick,
      }));
    }
    if (canPasteStartTime) {
      menu.append(new MenuItem({
        label: `Paste time as ${typeLabel} start time`,
        click: this.onPasteItemStartClick,
        enabled: boardCanPasteItem('inTime'),
      }));
    }
    if (canPasteEndTime) {
      menu.append(new MenuItem({
        label: `Paste time as ${typeLabel} end time`,
        click: this.onPasteItemEndClick,
        enabled: boardCanPasteItem('outTime'),
      }));
    }

    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }
  
  renderSimpleType = () => {
    const { style, data, layerDuration, getItemLabel, renderContent, children } = this.props;
    const { inTime, outTime, color, name } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.boardItem]: true,
          [styles.lightColor]: lightColor,
        })}
        style={{
          left: percentString(inTime / layerDuration),
          backgroundColor: color,
        }}
        onContextMenu={this.onContextMenuClick}
        onMouseDown={this.onStartAnchorDown}
      >
        <div
          className={classNames({
            [styles.labelFlag]: true,
          })}
          style={{
            backgroundColor: color,
          }}
        >
          { getItemLabel ? getItemLabel() : name }
        </div>
      </div>
    );
  }
  
  renderBlockType = () => {
    const { style, data, layerDuration, getItemLabel, renderContent, children } = this.props;
    const { inTime, outTime, color, name } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.boardItem]: true,
          [styles.lightColor]: lightColor,
        })}
        style={{
          // left: percentString(inTime / layerDuration),
          // width: percentString((outTime - inTime) / layerDuration),
          ...style,
          backgroundColor: color,
        }}
        onContextMenu={this.onContextMenuClick}
      >
        <div
          className={styles.header}
        >
          <div
            className={classNames({
              [styles.itemLabel]: true,
            })}
          >
           { getItemLabel ? getItemLabel() : name }
          </div>
        </div>
        <div
          className={classNames({
            [styles.content]: true,
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

export default boardConnect(BoardItem);
