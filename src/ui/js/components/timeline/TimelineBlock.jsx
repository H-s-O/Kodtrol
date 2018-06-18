import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import classNames from 'classnames'
import { isFunction } from 'lodash';
import { remote } from 'electron';
import Color from 'color';
import percentString from '../../lib/percentString';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  index: PropTypes.number,
  data: PropTypes.shape({}),
  layerDuration: PropTypes.number,
  onDeleteBlock: PropTypes.func,
  onEditBlock: PropTypes.func,
  onAdjustBlock: PropTypes.func,
};

const defaultProps = {
  index: 0,
  layerDuration: 0,
  data: null,
  onEditBlock: null,
  onDeleteBlock: null,
  onAdjustBlock: null,
};

class TimelineBlock extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onDeleteBlockClick() {
    const { onDeleteBlock, data } = this.props;
    if (isFunction(onDeleteBlock)) {
      onDeleteBlock(data);
    }
  }

  onEditBlockClick() {
    const { onEditBlock, data } = this.props;
    if (isFunction(onEditBlock)) {
      onEditBlock(data);
    }
  }

  onStartAnchorDown(e) {
    e.stopPropagation();
    e.preventDefault();
    this.onDragAnchorDown('inTime');
  }

  onEndAnchorDown(e) {
    e.stopPropagation();
    e.preventDefault();
    this.onDragAnchorDown('outTime');
  }

  onDragAnchorDown(mode) {
    const { onAdjustBlock, data } = this.props;
    if (isFunction(onAdjustBlock)) {
      onAdjustBlock(mode, data);
    }
  }

  onTimelineBlockContextMenu(e) {
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Edit block...',
      click: this.onEditBlockClick,
    }));
    menu.append(new MenuItem({
      label: 'Delete block',
      click: this.onDeleteBlockClick,
    }));

    e.stopPropagation();
    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  render() {
    const { data, layerDuration } = this.props;
    const { inTime, outTime, color, name } = data;
    const lightColor = Color(color).isLight();
    return (
      <div
        title={name}
        className={classNames({
          [styles.timelineBlock]: true,
          [styles.lightBlock]: lightColor,
        })}
        style={{
          left: percentString(inTime / layerDuration),
          backgroundColor: color,
          width: percentString((outTime - inTime) / layerDuration),
        }}
        onContextMenu={this.onTimelineBlockContextMenu}
      >
        <div
          className={classNames({
            [styles.bottomLayer]: true,
          })}
        >
          <div
            onMouseDown={this.onStartAnchorDown}
            className={classNames({
              [styles.dragAnchor]: true,
              [styles.leftAnchor]: true,
            })}
          />
          <div
            onMouseDown={this.onEndAnchorDown}
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
}

TimelineBlock.propTypes = propTypes;
TimelineBlock.defaultProps = defaultProps;

export default TimelineBlock;
