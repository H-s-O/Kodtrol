import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import classNames from 'classnames'
import { remote } from 'electron';

import { deleteWarning } from '../../lib/messageBoxes';
import percentString from '../../lib/percentString';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelineitem.scss';

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

class TimelineItem extends PureComponent {
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
    const { timelineEditItem, data } = this.props;
    const { id } = data;
    timelineEditItem(id);
  }

  onStartAnchorDown = (e) => {
    console.log('anchor start down');
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('inTime');
  }

  onEndAnchorDown = (e) => {
    console.log('anchor end down');
    e.stopPropagation();
    e.preventDefault();
    this.doDragAnchorDown('outTime');
  }

  doDragAnchorDown = (mode) => {
    const { timelineAdjustItem, data } = this.props;
    const { id } = data;
    timelineAdjustItem(id, mode);
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
      }));
    }
    if (canPasteEndTime) {
      menu.append(new MenuItem({
        label: `Paste time as ${typeLabel} end time`,
        click: this.onPasteItemEndClick,
      }));
    }

    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }
  
  renderBlockType = () => {
    const { style, data, layerDuration, getItemLabel, renderContent, children } = this.props;
    const { inTime, outTime, color, name } = data;
    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.timelineItem]: true,
          [styles.lightColor]: lightColor,
        })}
        style={{
          left: percentString(inTime / layerDuration),
          width: percentString((outTime - inTime) / layerDuration),
          backgroundColor: color,
        }}
        onContextMenu={this.onContextMenuClick}
      >
        <div
          className={styles.header}
        >
          <div
            className={classNames({
              [styles.controls]: true,
              [styles.leftControls]: true,
            })}
          >
            <div
              className={classNames({
                [styles.anchors]: true,
                [styles.leftAnchor]: true,
              })}
              onMouseDown={this.onStartAnchorDown}
            >
            </div>
          </div>
          <div
            className={classNames({
              [styles.itemLabel]: true,
            })}
          >
           { getItemLabel ? getItemLabel() : name }
         </div>
          <div
            className={classNames({
              [styles.controls]: true,
              [styles.rightControls]: true,
            })}
          >
            <div
              className={classNames({
                [styles.anchors]: true,
                [styles.rightAnchor]: true,
              })}
              onMouseDown={this.onEndAnchorDown}
            >
            </div>
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
    return this.renderBlockType();
  }
}

TimelineItem.propTypes = propTypes;
TimelineItem.defaultProps = defaultProps;

export default timelineConnect(TimelineItem);
