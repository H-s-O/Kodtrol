import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import { deleteWarning } from '../../lib/messageBoxes';

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
    deleteWarning('Are you sure you want to delete this timeline item ?', this.onDeleteItemCallback);
  }
  
  onDeleteItemCallback = (result) => {
    if (result) {
      const { onDeleteItem, data } = this.props;
      onDeleteItem(data);
    }
  }

  onEditItemClick = () => {
    const { onEditItem, data } = this.props;
    onEditItem(data);
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
    onAdjustItem(mode, data);
  }

  onCopyItemStartClick = () => {
    this.onCopyItemClick('inTime');
  }

  onCopyItemEndClick = () => {
    this.onCopyItemClick('outTime');
  }

  onCopyItemClick = (mode) => {
    const { onCopyItem, data } = this.props;
    onCopyItem(mode, data);
  }

  onPasteItemStartClick = () => {
    this.onPasteItemClick('inTime');
  }

  onPasteItemEndClick = () => {
    this.onPasteItemClick('outTime');
  }

  onPasteItemClick = (mode) => {
    const { onPasteItem, data } = this.props;
    onPasteItem(mode, data);
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
