import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import { deleteWarning } from '../../lib/messageBoxes';

const propTypes = {
  index: PropTypes.number,
  typeLabel: PropTypes.string,
  data: PropTypes.shape({}),
  layerDuration: PropTypes.number,
  renderItem: PropTypes.func,
  renderContextMenu: PropTypes.func,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onAdjustItem: PropTypes.func.isRequired,
  onCopyItem: PropTypes.func.isRequired,
  onPasteItem: PropTypes.func.isRequired,
};

const defaultProps = {
  typeLabel: 'item',
};

class TimelineItem extends PureComponent {
  onDeleteItemClick = () => {
    const { typeLabel, onDeleteItem, index } = this.props;
    deleteWarning(`Are you sure you want to delete this ${typeLabel} ?`, (result) => {
      if (result) {
        onDeleteItem(index);
      }
    });
  }
  
  onEditItemClick = () => {
    const { onEditItem, index } = this.props;
    onEditItem(index);
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

  doDragAnchorDown = (mode) => {
    const { onAdjustItem, index } = this.props;
    onAdjustItem(index, mode);
  }

  onCopyItemStartClick = () => {
    this.doCopyItemClick('inTime');
  }

  onCopyItemEndClick = () => {
    this.doCopyItemClick('outTime');
  }

  doCopyItemClick = (mode) => {
    const { onCopyItem, index } = this.props;
    onCopyItem(index, mode);
  }

  onPasteItemStartClick = () => {
    this.doPasteItemClick('inTime');
  }

  onPasteItemEndClick = () => {
    this.doPasteItemClick('outTime');
  }

  doPasteItemClick = (mode) => {
    const { onPasteItem, index } = this.props;
    onPasteItem(index, mode);
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
