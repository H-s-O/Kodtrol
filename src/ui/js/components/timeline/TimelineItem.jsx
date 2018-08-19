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

    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  render = () => {
    const { children: Children } = this.props;
    return Children;
  }
}

TimelineItem.propTypes = propTypes;
TimelineItem.defaultProps = defaultProps;

export default TimelineItem;
