import React, { PureComponent } from 'react';
import classNames from 'classnames'
import { remote } from 'electron';
import Color from 'color';
import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/partials/timeline.scss';

class TimelineTrigger extends PureComponent {
  renderTriggerContextMenu = (handlers) => {
    const {
      onEditItemClick,
      onDeleteItemClick,
      onCopyItemStartClick,
      onCopyItemEndClick,
      onPasteItemStartClick,
      onPasteItemEndClick,
    } = handlers;
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Edit trigger...',
      click: onEditItemClick,
    }));
    menu.append(new MenuItem({
      label: 'Delete trigger...',
      click: onDeleteItemClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Copy trigger time',
      click: onCopyItemStartClick,
    }));
    menu.append(new MenuItem({
      label: 'Paste time as trigger time',
      click: onPasteItemStartClick,
    }));

    return menu;
  }

  renderTrigger = (props, handlers) => {
    const { onContextMenuClick, onStartAnchorDown} = handlers;
    const { data, layerDuration } = this.props;
    const { inTime, color, trigger } = data;
    const lightColor = Color(color).isLight();

    return (
      <div
        className={classNames({
          [styles.timelineTrigger]: true,
          [styles.lightTrigger]: lightColor,
        })}
        style={{
          left: percentString(inTime / layerDuration),
          backgroundColor: color,
        }}
        onContextMenu={onContextMenuClick}
        onMouseDown={onStartAnchorDown}
      >
        <span
          style={{
            backgroundColor: color,
          }}
          className={styles.timelineTriggerLabel}
        >
          { trigger }
        </span>
      </div>
    );
  }

  render = () => {
    return (
      <TimelineItem
        {...this.props}
        renderItem={this.renderTrigger}
        renderContextMenu={this.renderTriggerContextMenu}
      />
    );
  }
}

export default TimelineTrigger;
