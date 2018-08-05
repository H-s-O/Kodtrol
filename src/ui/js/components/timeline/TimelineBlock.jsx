import React, { PureComponent } from 'react';
import classNames from 'classnames'
import { remote } from 'electron';
import Color from 'color';
import percentString from '../../lib/percentString';
import TimelineItem from './TimelineItem';

import styles from '../../../styles/components/partials/timeline.scss';

class TimelineBlock extends PureComponent {
  renderBlockContextMenu = (handlers) => {
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
      label: 'Edit block...',
      click: onEditItemClick,
    }));
    menu.append(new MenuItem({
      label: 'Delete block...',
      click: onDeleteItemClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Copy block start time',
      click: onCopyItemStartClick,
    }));
    menu.append(new MenuItem({
      label: 'Copy block end time',
      click: onCopyItemEndClick,
    }));
    menu.append(new MenuItem({
      label: 'Paste time as block start time',
      click: onPasteItemStartClick,
    }));
    menu.append(new MenuItem({
      label: 'Paste time as block end time',
      click: onPasteItemEndClick,
    }));

    return menu;
  }

  renderBlock = (props, handlers) => {
    const { onContextMenuClick, onStartAnchorDown, onEndAnchorDown} = handlers;
    const { data, layerDuration } = props;
    const { inTime, outTime, color, name } = data;
    const lightColor = Color(color).isLight();

    return (
      <div
        className={classNames({
          [styles.timelineBlock]: true,
          [styles.lightBlock]: lightColor,
        })}
        style={{
          left: percentString(inTime / layerDuration),
          backgroundColor: color,
          width: percentString((outTime - inTime) / layerDuration),
        }}
        onContextMenu={onContextMenuClick}
      >
        <div
          className={classNames({
            [styles.bottomLayer]: true,
          })}
        >
          <div
            onMouseDown={onStartAnchorDown}
            className={classNames({
              [styles.dragAnchor]: true,
              [styles.leftAnchor]: true,
            })}
          />
          <div
            onMouseDown={onEndAnchorDown}
            className={classNames({
              [styles.dragAnchor]: true,
              [styles.rightAnchor]: true,
            })}
          />
        </div>
        <div
          className={classNames({
            [styles.topLayer]: true,
          })}
        >
          <span
            style={{
              backgroundColor: color,
            }}
            className={styles.timelimeBlockLabel}
          >
            { name }
          </span>
        </div>
      </div>
    );
  }

  render = () => {
    return (
      <TimelineItem
        {...this.props}
        renderItem={this.renderBlock}
        renderContextMenu={this.renderBlockContextMenu}
      />
    );
  }
}

export default TimelineBlock;
