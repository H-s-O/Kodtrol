import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';

import { deleteWarning } from '../../lib/messageBoxes';
import timelineConnect from './timelineConnect';

const propTypes = {
  index: PropTypes.number,
  typeLabel: PropTypes.string,
  data: PropTypes.shape({}),
  layerDuration: PropTypes.number,
  renderItem: PropTypes.func,
  canCopyStartTime: PropTypes.bool,
  canCopyEndTime: PropTypes.bool,
  canPasteStartTime: PropTypes.bool,
  canPasteEndTime: PropTypes.bool,
};

const defaultProps = {
  typeLabel: 'item',
  canCopyStartTime: true,
  canCopyEndTime: true,
  canPasteStartTime: true,
  canPasteEndTime: true,
};

class TimelineItem extends PureComponent {
  onDeleteItemClick = () => {
    const { typeLabel } = this.props;
    deleteWarning(`Are you sure you want to delete this ${typeLabel} ?`, (result) => {
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

  render = () => {
    const { children } = this.props;
    // @see https://stackoverflow.com/a/35102287
    return React.cloneElement(children, {
      onContextMenu: this.onContextMenuClick,
    });
  }
}

TimelineItem.propTypes = propTypes;
TimelineItem.defaultProps = defaultProps;

export default timelineConnect(TimelineItem);
