import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import classNames from 'classnames'
import { remote } from 'electron';

import { deleteWarning } from '../../lib/messageBoxes';
import isFunction from '../../lib/isFunction';

import styles from '../../../styles/components/timeline/timelineitem.scss';

const propTypes = {
  data: PropTypes.shape({}).isRequired,
  timelineDeleteItem: PropTypes.func.isRequired,
  timelineEditItem: PropTypes.func.isRequired,
  timelineCopyItem: PropTypes.func.isRequired,
  timelinePasteItem: PropTypes.func.isRequired,
  timelineAdjustItem: PropTypes.func.isRequired,
  //
  getItemLabel: PropTypes.func,
  getDialogLabel: PropTypes.func,
  type: PropTypes.oneOf(['block', 'simple']),
  typeLabel: PropTypes.string,
  canCopyStartTime: PropTypes.bool,
  canCopyEndTime: PropTypes.bool,
  canPasteStartTime: PropTypes.bool,
  canPasteEndTime: PropTypes.bool,
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
  ////////////////////////////////////////////////////////////////
  // EVENT HANDLERS

  onDeleteItemClick = () => {
    const { getDialogLabel, data, typeLabel } = this.props;
    const { name } = data;
    const label = isFunction(getDialogLabel) ? getDialogLabel() : name;
    
    deleteWarning(`Are you sure you want to delete the ${typeLabel} "${label}"?`, (result) => {
      if (result) {
        this.doDeleteItem();
      }
    });
  }
  
  onEditItemClick = () => {
    this.doEditItem();
  }

  onStartAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.doDragAnchorDown('inTime');
  }

  onEndAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.doDragAnchorDown('outTime');
  }

  onCopyItemClick = () => {
    this.doCopyItem('*');
  }
  
  onCopyItemStartClick = () => {
    this.doCopyItem('inTime');
  }

  onCopyItemEndClick = () => {
    this.doCopyItem('outTime');
  }

  onPasteItemStartClick = () => {
    this.doPasteItem('inTime');
  }

  onPasteItemEndClick = () => {
    this.doPasteItem('outTime');
  }

  onContextMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.doContextMenu();
  }

  /////////////////////////////////////////////////////////
  // ACTIONS

  doDeleteItem = () => {
    const { timelineDeleteItem, data } = this.props;
    const { id } = data;
    timelineDeleteItem(id);
  }

  doEditItem = () => {
    const { timelineEditItem, data } = this.props;
    const { id } = data;
    timelineEditItem(id);
  }

  doDragAnchorDown = (mode) => {
    const { timelineAdjustItem, data } = this.props;
    const { id } = data;
    timelineAdjustItem(id, mode);
  }

  doCopyItem = (mode) => {
    const { timelineCopyItem, data } = this.props;
    const { id } = data;
    timelineCopyItem(id, mode);
  }

  doPasteItem = (mode) => {
    const { timelinePasteItem, data } = this.props;
    const { id } = data;
    timelinePasteItem(id, mode);
  }

  onContextMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const {
      typeLabel,
      canCopyStartTime,
      canCopyEndTime,
      canPasteStartTime,
      canPasteEndTime,
      timelineCanPasteItem,
    } = this.props;
    const { Menu } = remote;

    const template = [
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
    ];
    if (canCopyStartTime) {
      template.push({
        label: `Copy ${typeLabel} start time`,
        click: this.onCopyItemStartClick,
      });
    }
    if (canCopyEndTime) {
      template.push({
        label: `Copy ${typeLabel} end time`,
        click: this.onCopyItemEndClick,
      });
    }
    if (canPasteStartTime) {
      template.push({
        label: `Paste time as ${typeLabel} start time`,
        click: this.onPasteItemStartClick,
        enabled: timelineCanPasteItem('inTime'),
      });
    }
    if (canPasteEndTime) {
      template.push({
        label: `Paste time as ${typeLabel} end time`,
        click: this.onPasteItemEndClick,
        enabled: timelineCanPasteItem('outTime'),
      });
    }

    const menu = Menu.buildFromTemplate(template);
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  /////////////////////////////////////////////////////////
  // RENDERS
  
  renderSimpleType = () => {
    const { style, data, getItemLabel } = this.props;
    const { color, name } = data;

    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.timelineSimpleItem]: true,
          [styles.simpleLightColor]: lightColor,
        })}
        style={{
          ...style,
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
          { isFunction(getItemLabel) ? getItemLabel() : name }
        </div>
      </div>
    );
  }
  
  renderBlockType = () => {
    const { style, data, getItemLabel, children } = this.props;
    const { color, name } = data;
    
    const lightColor = Color(color).isLight();
    
    return (
      <div
        className={classNames({
          [styles.timelineItem]: true,
          [styles.lightColor]: lightColor,
        })}
        style={{
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
           { isFunction(getItemLabel) ? getItemLabel() : name }
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
    const { type } = this.props;
    return type === 'simple' ? this.renderSimpleType() : this.renderBlockType();
  }
}

TimelineItem.propTypes = propTypes;
TimelineItem.defaultProps = defaultProps;

export default TimelineItem;
