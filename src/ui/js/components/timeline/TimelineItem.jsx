import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { remote } from 'electron';

const propTypes = {
  index: PropTypes.number,
  data: PropTypes.shape({}),
  layerDuration: PropTypes.number,
  renderItem: PropTypes.func,
  renderContextMenu: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onAdjustItem: PropTypes.func,
  onCopyItem: PropTypes.func,
  onPasteItem: PropTypes.func,
};

const defaultProps = {
  onEditItem: null,
  onDeleteItem: null,
  onAdjustItem: null,
  onCopyItem: null,
  onPasteItem: null,
};

class TimelineItem extends PureComponent {
  onDeleteItemClick = () => {
    const { onDeleteItem, data } = this.props;
    if (isFunction(onDeleteItem)) {
      onDeleteItem(data);
    }
  }

  onEditItemClick = () => {
    const { onEditItem, data } = this.props;
    if (isFunction(onEditItem)) {
      onEditItem(data);
    }
  }

  onStartAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.onDragAnchorDown('inTime');
  }

  onEndAnchorDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.onDragAnchorDown('outTime');
  }

  onDragAnchorDown = (mode) => {
    const { onAdjustItem, data } = this.props;
    if (isFunction(onAdjustItem)) {
      onAdjustItem(mode, data);
    }
  }

  onCopyItemStartClick = () => {
    this.onCopyItemClick('inTime');
  }

  onCopyItemEndClick = () => {
    this.onCopyItemClick('outTime');
  }

  onCopyItemClick = (mode) => {
    const { onCopyItem, data } = this.props;
    if (isFunction(onCopyItem)) {
      onCopyItem(mode, data);
    }
  }

  onPasteItemStartClick = () => {
    this.onPasteItemClick('inTime');
  }

  onPasteItemEndClick = () => {
    this.onPasteItemClick('outTime');
  }

  onPasteItemClick = (mode) => {
    const { onPasteItem, data } = this.props;
    if (isFunction(onPasteItem)) {
      onPasteItem(mode, data);
    }
  }

  onContextMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { renderContextMenu } = this.props;
    const handlers = {
      onEditItemClick: this.onEditItemClick,
      onDeleteItemClick: this.onDeleteItemClick,
      onCopyItemStartClick: this.onCopyItemStartClick,
      onCopyItemEndClick: this.onCopyItemEndClick,
      onPasteItemStartClick: this.onPasteItemStartClick,
      onPasteItemEndClick: this.onPasteItemEndClick,
    };

    const menu = renderContextMenu(handlers);
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  render = () => {
    const { renderItem } = this.props;
    const handlers = {
      onContextMenuClick: this.onContextMenuClick,
      onStartAnchorDown: this.onStartAnchorDown,
      onEndAnchorDown: this.onEndAnchorDown,
    };
    return renderItem(this.props, handlers);
  }
}

TimelineItem.propTypes = propTypes;
TimelineItem.defaultProps = defaultProps;

export default TimelineItem;
